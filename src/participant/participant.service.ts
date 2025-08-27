import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import readXlsxFile from 'read-excel-file/node';
import { ParticipantModels } from "./models/participant-model";
import { CreateParticipantDto } from "./dto/participant.dto";
import { UpdateNomineesDto } from "./dto/nomine-update.dto";
import { LoginDto } from "./dto/phone-number.dto";
import { IndiceNomine } from '@prisma/client';
import { VoteDto } from "./dto/vote.dto";
import * as bcrypt from 'bcrypt';
import { Cron, CronExpression } from "@nestjs/schedule";
import { CustomEnum } from "src/util/custom-enum";
import { Decrypt, Encrypt } from "src/util/crypto-utils";



@Injectable()
export class ParticipantService {
  constructor(private prisma: PrismaService,
  ) { }

  async importParticipant(fileBuffer: Buffer): Promise<any[]> {
    const operations = [];
    try {
      const { rows, errors } = await readXlsxFile(fileBuffer, { schema: ParticipantModels });

      // Vérifiez les erreurs de lecture ici
      if (errors.length > 0) {
        throw new Error('Erreur lors de l’analyse du fichier Excel');
      }

      operations.push(...rows);
    } catch (error) {
      throw new Error('Erreur lors de la lecture du fichier Excel: ' + error.message);
    }
    return operations;
  }

  async parseExcelFile(createParticipantDto: CreateParticipantDto, fileBuffer: any) {
    const oper = await this.importParticipant(fileBuffer);

    // Récupérer les participants existants
    const existingParticipants = await this.prisma.participant.findMany({
      where: {
        OR: oper.map((item) => ({
          firstname: item.firstname,
          lastname: item.lastname,
        })),
      },
    });



    const existingSet = new Set(existingParticipants.map(participant => `${participant.firstname} ${participant.lastname}`));


    const uniqueParticipants = oper.filter(item => {
      const fullName = `${item.firstname} ${item.lastname}`;
      return !existingSet.has(fullName);
    });

    await this.prisma.participant.createMany({
      data: uniqueParticipants.map((item) => {

        // const passwordPrefix = item.firstname.substring(0, 4);
        // const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
        // const defaultPassword = `${passwordPrefix}${randomDigits}`;

        return {
          firstname: item.firstname,
          lastname: item.lastname,
          photo_url: item.photo_url,
          secret: item.secret ? Encrypt(item.secret.toString(), CustomEnum) : null,
          phone_number: item.phone_number.replace(/\s+/g, ''),
          numeroIdentite: item.numeroIdentite,
          password: item.password,
        };
      }),
    });

    // Récupération des participants pour retourner les IDs
    const participantsWithIds = await this.prisma.participant.findMany({
      where: {
        firstname: { in: uniqueParticipants.map((item) => item.firstname) },
        lastname: { in: uniqueParticipants.map((item) => item.lastname) },
      },
    });

    return { participantsWithIds };
  }



  async getAllParticipant() {
    const getAll = await this.prisma.participant.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        photo_url: true,
        isConnect: true,
        secret: true,
        status: true,
        points: true,
      },
    });
    
  const filteredParticipants = getAll.filter(participant => participant.id !== 9);
    return filteredParticipants.map(participant => ({
      ...participant,
      secret: participant.status === false && participant.secret
        ? Decrypt(participant.secret, CustomEnum)
        : null,
    }));
  }


  async ParticipantBackOffice() {
    const getAll = await this.prisma.participant.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        photo_url: true,
        phone_number: true,
        isConnect: true,
        secret: true,
        status: true,
        points: true,
        password: true,
        nomination: true,
        nomines: {
          select: {
            indice: true
          },
        },
      },
    });
    return getAll

  }

  private getRandomElements(array: any[], count: number) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  async getNomines(limit = 10): Promise<{
    nomines: IndiceNomine[];
    totalParticipants: number;
    totalNonNomines: number;
    totalNomines: number;
    totalExNomine: number;
  }> {

    // const lastGroup = await this.prisma.participant.findFirst({
    //   orderBy: { created_at: 'desc' },
    //   select: { groupeNomination: true },
    //   where: { groupeNomination: { not: null } }
    // });
  
    // // Calcul du prochain numéro de groupe
    // const nextGroupNumber = lastGroup ? parseInt(lastGroup.groupeNomination.replace('groupe', '')) + 1 : 1;
    // const nextGroup = `groupe${nextGroupNumber}`;

    const activeParticipantsCount = await this.prisma.participant.count({
      where: { status: true },
    });
    const activeExNomineCount = await this.prisma.participant.count({
      where: {
        status: true,
        nomination: 'Ex_nomine',
      },
    });

    if (activeExNomineCount === activeParticipantsCount) {
      await this.prisma.participant.updateMany({
        where: { status: true, nomination: 'Ex_nomine' },
        data: { nomination: null },
      });

      // await this.prisma.indiceNomine.deleteMany({
      // });
      // await this.prisma.vote.deleteMany({
      // });
    }

    const ongoingNominations = await this.prisma.participant.findMany({
      where: { nomination: 'En_cours_de_nomination' },
    });
    if (ongoingNominations.length > 0) {
      throw new ConflictException('Des participants sont déjà en cours de nomination.');
    }

    const activeNomineesCount = await this.prisma.participant.count({
      where: {
        status: true,
        nomination: 'Nomine',
      },
    });

    if (activeNomineesCount > 0) {
      await this.prisma.participant.updateMany({
        where: {
          status: true,
          nomination: 'Nomine',
        },
        data: { nomination: 'Ex_nomine' },
      });
    }

    await this.prisma.participant.updateMany({
      where: {
        status: false,
        nomination: 'Nomine',
      },
      data: { nomination: null },
    });

    const activeParticipants = await this.prisma.participant.findMany({
      where: {
        status: true,
        nomination: null,
      },
    });

    if (activeParticipants.length === 0) {
      return {
        nomines: [],
        totalParticipants: 0,
        totalNonNomines: 0,
        totalNomines: 0,
        totalExNomine: 0,
      };
    }



    const selectedNominees = this.getRandomElements(activeParticipants, Math.min(limit, activeParticipants.length));

    const createdNominees = await Promise.all(
      selectedNominees.map(async (participant) => {
        await this.prisma.participant.update({
          where: { id: participant.id },
          data: { nomination: 'En_cours_de_nomination',
            // groupeNomination: nextGroup
           },
        });


        return await this.prisma.indiceNomine.create({
          data: {
            indice: "",
            participantId: participant.id,
          },
        });
      })
    );

    // Étape 4 : Calculer les totaux pour le retour de fonction
    const totalParticipants = await this.prisma.participant.count();
    const totalNonNomines = await this.prisma.participant.count({ where: { status: true, nomination: null } });
    const totalNomines = await this.prisma.participant.count({ where: { nomination: 'Nomine' } });
    const totalExNomine = await this.prisma.participant.count({ where: { nomination: 'Ex_nomine' } });

    return {
      nomines: createdNominees,
      totalParticipants,
      totalNonNomines,
      totalNomines,
      totalExNomine,
    };
  }





  async listNomineEncour() {
    return this.prisma.participant.findMany({
      where: {
        nomination: 'En_cours_de_nomination',
        nomines: {
          some: {}, // Vérifie qu'il y a au moins un enregistrement dans `nomines`, indiquant que le participant est nominé
        },
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        photo_url: true,
        secret: true,
        status: true,
        nomination: true,
        numeroIdentite: true,
        nomines: {
          select: {
            indice: true
          },
        },
      },
    });
  }

  async updateNomineesInsertIndice(updateNomineesDto: UpdateNomineesDto) {
    const updates = await Promise.all(updateNomineesDto.nominees.map(async nominee => {

      await this.prisma.$transaction(async (prisma) => {
        const participant = await prisma.participant.findUnique({
          where: { id: nominee.participantId },
        });

        if (!participant) {
          throw new Error(`Participant avec id ${nominee.participantId} non trouvé.`);
        }

        await prisma.indiceNomine.update({
          where: { participantId: nominee.participantId },
          data: {
            indice: nominee.indice ? Encrypt(nominee.indice.toString(), CustomEnum) : null,
            participant: {
              update: {
                nomination: 'Nomine',
              },
            },
          },
        });
      });

      return {
        id: nominee.participantId,
        indice: nominee.indice,
      };
    }));

    return updates;
  }


  public async encryptId(id: number): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(id.toString(), salt);
  }

  public async listNominatedParticipants() {
    const participants = await this.prisma.participant.findMany({
      where: {
        nomination: 'Nomine',
      },
      select: {
        secret: true,
        numeroIdentite: true,
        nomines: {
          select: {
            indice: true,
          },
        },
      },
    });

    return participants.map(participant => ({
      ...participant,
      secret: participant.secret ? Decrypt(participant.secret, CustomEnum) : null,
      nomines: participant.nomines.map(nomine => ({
        ...nomine,
        indice: nomine.indice ? Decrypt(nomine.indice, CustomEnum) : null,
      })),
    }));
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async loginWithPhone(loginDto: LoginDto) {
    const participant = await this.prisma.participant.findUnique({
      where: { phone_number: loginDto.phone_number },
    });

    if (!participant) {
      throw new UnauthorizedException("Numéro de téléphone non reconnu.");
    }

    if (!participant.password) {
      throw new UnauthorizedException("Aucun mot de passe enregistré pour ce participant.");
    }

    if (loginDto.password !== participant.password) {

      throw new UnauthorizedException("Mot de passe incorrect.");
    }

    await this.prisma.participant.update({
      where: { id: participant.id },
      data: { isConnect: 1 },
    });

    return {
      participantId_connecte: participant.id,
      status: true,
      isConnect: 1,
    };
  }


  async logoutParticipant(participantId: number) {
    const participant = await this.prisma.participant.findFirst({
      where: { id: participantId, isConnect: 1 },
    });

    if (!participant) {
      throw new UnauthorizedException("Ce numero n'est pas connecté");
    }

    await this.prisma.participant.update({
      where: { id: participant.id },
      data: { isConnect: 0 },
    });

    return {
      participantId: participant.id,
      isConnect: participant.isConnect,
    };
  }



  async voteForParticipant(voteDto: VoteDto, participantId: number) {
    const user = await this.prisma.participant.findUnique({
      where: { id: participantId },
    });
  
    if (!user || user.isConnect !== 1) {
      throw new ForbiddenException('Vous devez être connecté pour voter.');
    }

    const nominatedParticipant = await this.prisma.participant.findFirst({
      where: { numeroIdentite: voteDto.numeroID, nomination: 'Nomine' },
      select: {
        id: true,
        secret: true,
        nomination: true,
        status: true,
        numeroIdentite: true,
        // groupeNomination: true, // Ajout de groupeNomination dans la sélection
        nomines: {
          select: {
            indice: true,
          },
        },
      },
    });
  
    const existingVote = await this.prisma.vote.findFirst({
      where: {
        participantId: participantId,
        numeroID: voteDto.numeroID,
        // groupe: nominatedParticipant.groupeNomination
      }
    });
    if (existingVote) {
      throw new ForbiddenException('Vous avez déjà voté pour ce nominé');
    }
  

  
    const participantNomine = await this.prisma.participant.findFirst({
      where: {
        id: voteDto.selectedParticipantId,
        numeroIdentite: voteDto.numeroID,
        nomination: 'Nomine'
      },
    });
  
    if (!participantNomine && nominatedParticipant.status === false) {
      const participantExists = await this.prisma.participant.findUnique({
        where: { id: participantId },
      });
      const nomineeExists = await this.prisma.participant.findUnique({
        where: { numeroIdentite: voteDto.numeroID },
      });
  
      if (!participantExists || !nomineeExists) {
        throw new NotFoundException('Participant ou nominé non trouvé.');
      }
  
      await this.prisma.participant.update({
        where: { numeroIdentite: nominatedParticipant.numeroIdentite },
        data: { status: false },
      });
  
      await this.prisma.participant.update({
        where: { id: participantId },
        data: {
          points: { increment: 0 }
        },
      });
  
      await this.prisma.vote.create({
        data: {
          participantId: participantId,
          numeroID: nominatedParticipant.numeroIdentite,
          selectedParticipantId: voteDto.selectedParticipantId,
          // groupe: nominatedParticipant.groupeNomination
        },
      });
      return { message: 'Vote enregistré avec succès.', participantId };
    }
  
    if (!nominatedParticipant) {
      throw new NotFoundException('Nomination non trouvée ');
    }
  
    if (user.status === false && nominatedParticipant.status === false) {
      const participantExists = await this.prisma.participant.findUnique({
        where: { id: participantId },
      });
      const nomineeExists = await this.prisma.participant.findUnique({
        where: { numeroIdentite: voteDto.numeroID },
      });
  
      if (!participantExists || !nomineeExists) {
        throw new NotFoundException('Participant ou nominé non trouvé.');
      }
  
      await this.prisma.participant.update({
        where: { numeroIdentite: nominatedParticipant.numeroIdentite },
        data: { status: false },
      });
  
      await this.prisma.participant.update({
        where: { id: participantId },
        data: {
          points: { increment: 0 }
        },
      });
  
      await this.prisma.vote.create({
        data: {
          participantId: participantId,
          numeroID: nominatedParticipant.numeroIdentite,
          selectedParticipantId: voteDto.selectedParticipantId,
          // groupe: nominatedParticipant.groupeNomination 
        },
      });
      return { message: 'Vote enregistré avec succès.', participantId };
    }
  
    if (participantNomine && (participantId === voteDto.selectedParticipantId)) {
      const participantExists = await this.prisma.participant.findUnique({
        where: { id: participantId },
      });
  
      const nomineeExists = await this.prisma.participant.findUnique({
        where: { numeroIdentite: voteDto.numeroID },
      });
  
      if (!participantExists || !nomineeExists) {
        throw new NotFoundException('Participant ou nominé non trouvé.');
      }
  
      await this.prisma.participant.update({
        where: { numeroIdentite: nominatedParticipant.numeroIdentite },
        data: { status: false },
      });
  
      await this.prisma.participant.update({
        where: { id: participantId },
        data: {
          points: { increment: 0 }
        },
      });
  
      await this.prisma.vote.create({
        data: {
          participantId: participantId,
          numeroID: nominatedParticipant.numeroIdentite,
          selectedParticipantId: voteDto.selectedParticipantId,
          // groupe: nominatedParticipant.groupeNomination // Ajout du groupe de nomination
        },
      });
      return { message: 'Vote enregistré avec succès.', participantId };
    }
  
    if (participantNomine && (nominatedParticipant.status === false)) {
      const participantExists = await this.prisma.participant.findUnique({
        where: { id: participantId },
      });
  
      const nomineeExists = await this.prisma.participant.findUnique({
        where: { numeroIdentite: voteDto.numeroID },
      });
  
      if (!participantExists || !nomineeExists) {
        throw new NotFoundException('Participant ou nominé non trouvé.');
      }
  
      await this.prisma.participant.update({
        where: { numeroIdentite: nominatedParticipant.numeroIdentite },
        data: { status: false },
      });
  
      await this.prisma.participant.update({
        where: { id: participantId },
        data: {
          points: { increment: 0 }
        },
      });
  
      await this.prisma.vote.create({
        data: {
          participantId: participantId,
          numeroID: nominatedParticipant.numeroIdentite,
          selectedParticipantId: voteDto.selectedParticipantId,
          // groupe: nominatedParticipant.groupeNomination// Ajout du groupe de nomination
        },
      });
      return { message: 'Vote enregistré avec succès.', participantId };
    }
  
    if (!participantNomine) {
      const participantExists = await this.prisma.participant.findUnique({
        where: { id: participantId },
      });
      const nomineeExists = await this.prisma.participant.findUnique({
        where: { numeroIdentite: voteDto.numeroID },
      });
  
      if (!participantExists || !nomineeExists) {
        throw new NotFoundException('Participant ou nominé non trouvé.');
      }
  
      await this.prisma.participant.update({
        where: { numeroIdentite: nominatedParticipant.numeroIdentite },
        data: { status: true },
      });
  
      await this.prisma.participant.update({
        where: { id: participantId },
        data: {
          points: { increment: 0 }
        },
      });
  
      await this.prisma.vote.create({
        data: {
          participantId: participantId,
          numeroID: nominatedParticipant.numeroIdentite,
          selectedParticipantId: voteDto.selectedParticipantId,
          // groupe: nominatedParticipant.groupeNomination// Ajout du groupe de nomination
        },
      });
      return { message: 'Vote enregistré avec succès.', participantId };
    }
  
    if (participantNomine) {
      const participantExists = await this.prisma.participant.findUnique({
        where: { id: participantId },
      });
  
      const nomineeExists = await this.prisma.participant.findUnique({
        where: { numeroIdentite: voteDto.numeroID },
      });
  
      if (!participantExists || !nomineeExists) {
        throw new NotFoundException('Participant ou nominé non trouvé.');
      }
  
      await this.prisma.participant.update({
        where: { numeroIdentite: nominatedParticipant.numeroIdentite },
        data: { status: false },
      });
  
      await this.prisma.participant.update({
        where: { id: participantId },
        data: {
          points: { increment: 1 }
        },
      });
  
      await this.prisma.vote.create({
        data: {
          participantId: participantId,
          numeroID: nominatedParticipant.numeroIdentite,
          selectedParticipantId: voteDto.selectedParticipantId,
          // groupe: nominatedParticipant.groupeNomination// Ajout du groupe de nomination
        },
      });
      return { message: 'Vote enregistré avec succès.', participantId };
    }



    if (!(voteDto.numeroID && voteDto.selectedParticipantId === nominatedParticipant.id)) {


      const participantExists = await this.prisma.participant.findUnique({
        where: { id: participantId },
      });

      const nomineeExists = await this.prisma.participant.findUnique({
        where: { numeroIdentite: voteDto.numeroID },
      });

      if (!participantExists || !nomineeExists) {
        throw new NotFoundException('Participant ou nominé non trouvé.');
      }

      await this.prisma.participant.update({
        where: { id: participantId },
        data: {
          points: { increment: 0 }
        },
      });

      await this.prisma.participant.update({
        where: { numeroIdentite: nominatedParticipant.numeroIdentite },
        data: { status: true }
      });

      await this.prisma.vote.create({
        data: {
          participantId: participantId,
          numeroID: nominatedParticipant.numeroIdentite,
          selectedParticipantId: voteDto.selectedParticipantId,
          // groupe: nominatedParticipant.groupeNomination
        },
      });

      return { message: 'Vote enregistré avec succès.', participantId };
    }

  }


  async findByPhoneNumber(phoneNumber: string) {
    return this.prisma.participant.findFirst({
      where: { phone_number: phoneNumber, isConnect: 1 },
    });
  }



  async getVotesByParticipant(participantId: number) {


    return await this.prisma.vote.findMany({
      where: {
        participantId: participantId,
      },
      include: {
        selectedParticipant: {
          select: {
            firstname: true,
            lastname: true,
            numeroIdentite: true, //
          }
        },
      },
    });
  }


  async getVotesByParticipantFrontOffice(participantId: number) {
    // Récupérer tous les groupes existants et extraire les numéros
    // const groups = await this.prisma.vote.findMany({
    //   select: {
    //     groupe: true,
    //   },
    //   distinct: ['groupe'], // Obtenir chaque groupe unique
    // });
  
    // if (!groups || groups.length === 0) {
    //   return []; // Retourne une liste vide si aucun groupe n'est trouvé
    // }
  
    // Extraire les numéros de groupe et trouver le plus grand numéro
    // const lastGroupNumber = Math.max(
    //   ...groups.map(g => parseInt(g.groupe.replace('groupe', ''), 10))
    // );
    // const lastGroupName = `groupe${lastGroupNumber}`;
  
    // Récupérer les votes du participant pour le dernier groupe
    return await this.prisma.vote.findMany({
      where: {
        participantId: participantId,
        // groupe: lastGroupName, // Filtrer par le nom du dernier groupe généré
      },
      select: {
        numeroID: true,
        // groupe: true,
        selectedParticipant: {
          select: {
            firstname: true,
            lastname: true,
          }
        }
      }
    });
  }
  



  async updateNomineesToExNomine(ids: number[]): Promise<{ updatedIds: number[] }> {

    await this.prisma.participant.updateMany({
      where: { id: { in: ids }, nomination: 'Nomine', status: true },
      data: { nomination: 'Ex_nomine' },
    });

    return { updatedIds: ids };
  }



}
