import { BadRequestException, Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import HttpResponse from "src/response/response";
import { ParticipantService } from "./participant.service";
import { CreateParticipantDto } from "./dto/participant.dto";
import { UpdateNomineesDto } from "./dto/nomine-update.dto";
import { PhoneNumberDto } from "./dto/phone-number.dto";
import { VoteDto } from "./dto/vote.dto";
import { UpdateNomineeStatusDto } from "./dto/change-status-nomine.dto";

@Controller('v1/participants')
export class ParticipantController {
  constructor(private readonly participantsService: ParticipantService) { }

  @ApiTags('APIs backoffice')
  @Post()
  @ApiResponse({
    status: 201,
    description: "Upload les participants",
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload les participants' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcelFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createParticipantDto: CreateParticipantDto
  ) {
    if (!file || !file.buffer) {
      throw new Error('Le fichier est requis');
    }
    return HttpResponse.send(
      this.participantsService.parseExcelFile(createParticipantDto, file.buffer),  // file.buffer est utilisé ici
      'Fichier des participants chargé avec succès',
    );
  }


  @ApiTags('APIs backoffice')
  @Post('genere/nomines')
  @ApiResponse({
    status: 200,
    description: "Générer des nominés",
  })
  @ApiOperation({ summary: 'Générer des nominés' })
  async getNominés(@Query('limit') limit: number): Promise<any> {

    // Validation : le nombre de nominés ne peut pas dépasser 15
    if (limit > 10) {
      throw new BadRequestException('Le nombre de nominés ne peut pas dépasser 10.');
    }

    if (limit < 1) {
      throw new BadRequestException('Le nombre de nominés doit être d\'au moins 1.');
    }

    // Appel du service pour obtenir les nominés et les statistiques
    const { nomines, totalParticipants, totalNonNomines, totalNomines,totalExNomine } = await this.participantsService.getNomines(limit);

    return {
      nomines,
      totalParticipants,
      totalNonNomines,
      totalNomines,
      totalExNomine
    };
  }




  @ApiTags('APIs backoffice')
  @Post('encour-nomination')
  @ApiResponse({
    status: 200,
    description: "Lister les participant encour de nomination",
  })
  @ApiOperation({ summary: `Lister les participant encour de nomination` })
  listNominees() {
    const message = 'Opération effectuée avec succès';
    return HttpResponse.send(
      this.participantsService.listNomineEncour(),
      message,
    );
  }


  @ApiTags('APIs front-office')
  @Get()
  @ApiResponse({
    status: 200,
    description: "Rechercher participants front-office",
  })
  @ApiOperation({ summary: 'Rechercher participants front-office' })
  getAllParticipants() {
    const message = 'Opération effectuée avec succès';
    return HttpResponse.send(
      this.participantsService.getAllParticipant(),
      message,
    );
  }


  @ApiTags('APIs backoffice')
  @Post('/participants')
  @ApiResponse({
    status: 200,
    description: "Rechercher tous les participants back-office",
  })
  @ApiOperation({ summary: 'Rechercher tous les participants back-office' })
  ParticipantBackOffice() {
    const message = 'Opération effectuée avec succès';
    return HttpResponse.send(
      this.participantsService.ParticipantBackOffice(),
      message,
    );
  }


  @ApiTags('APIs backoffice')
  @Put('nomines/update')
  @ApiResponse({
    status: 200,
    description: "Modifier l'indice d'un ou plusieurs participant(s) encour de nomination",
  })
  @ApiOperation({ summary: `Modifier l'indice d'un ou plusieur participant(s) encour de nomination` })
  updateNomineesInsertIndice(@Body() updateNomineeDto: UpdateNomineesDto) {
    const message = 'Opération effectuée avec succès';
    return HttpResponse.send(
      this.participantsService.updateNomineesInsertIndice(updateNomineeDto),
      message,
    );
  }


 
  @ApiTags('APIs votant')
  @Post('/list-nomine')
  @ApiResponse({
    status: 200,
    description: "Lister les participants nomine",
  })
  @ApiOperation({ summary: `Lister les participants nomine` })
  listNomine() {
    const message = 'Opération effectuée avec succès';
    return HttpResponse.send(
      this.participantsService.listNominatedParticipants(),
      message,
    );
  }

  @ApiTags('APIs votant')
  @Post('login')
  @ApiResponse({
    status: 200,
    description: "se connecté avec votre numero de telephone",
  })
  @ApiOperation({ summary: `se connecté avec votre numero de telephone` })
  async login(@Body() phoneNumber: PhoneNumberDto) {
    const message = 'Opération effectuée avec succès';
    return HttpResponse.send(
      this.participantsService.loginWithPhone(phoneNumber),
      message,
    );
  }


  @ApiTags('APIs votant')
  @Get('logout/:id')
  @ApiResponse({
    status: 200,
    description: "se déconnecté avec l'id du participant connecté",
  })
  @ApiOperation({ summary: `se déconnecté avec l'id du participant connecté` })
  async logout(@Param('id', ParseIntPipe) participantId: number, ) {
    const message = 'Opération effectuée avec succès';
    return HttpResponse.send(
      this.participantsService.logoutParticipant(participantId),
      message,
    );
  }


  @ApiTags('APIs votant')
  @Put('nomines/:id/vote')
  @ApiResponse({
    status: 200,
    description: "voté un nomine",
  })
  @ApiOperation({ summary: `voté un nomine` })
  async voted(
    @Param('id', ParseIntPipe) participantId: number, 
    @Body() voteDto: VoteDto,) {
      console.log('ok:',participantId);
      
      const message = 'Opération effectuée avec succès';
    return HttpResponse.send(
      this.participantsService.voteForParticipant(voteDto, participantId),
      message,
    );
  }



  @ApiTags('APIs votant')
  @ApiResponse({
    status: 200,
    description: "liste de vote d'un participant",
  })
  @ApiOperation({ summary: `liste de vote d'un participant` })
  @Post('participant/votes/:id')
  async getVotesByParticipant(@Param('id') participantId: number) {
    
    const votes = await this.participantsService.getVotesByParticipant(participantId);
    
    if (!votes || votes.length === 0) {
      throw new NotFoundException(`Aucun vote trouvé pour le participant avec l'ID ${participantId}`);
    }
    const totalVotes = votes.length;
    return {votes, totalVotes};
  }

  @ApiTags('APIs votant')
  @ApiResponse({
    status: 200,
    description: "liste de vote d'un participant front office",
  })
  @ApiOperation({ summary: `liste de vote d'un participant front office` })
  @Post('votes/FrontOffice/:id')
  async getVotesByParticipantFrontOffice(@Param('id') participantId: number) {
    
    const votes = await this.participantsService.getVotesByParticipantFrontOffice(participantId);
    
    if (!votes || votes.length === 0) {
      throw new NotFoundException(`Aucun vote trouvé pour le participant avec l'ID ${participantId}`);
    }
    const totalVotes = votes.length;
    return {votes, totalVotes};
  }


  @ApiTags('APIs votant')
  @ApiResponse({
    status: 200,
    description: "changer status nomine ",
  })
  @ApiOperation({ summary: `changer status nomine ` })
  @Patch('update-active-nominees')
  async updateActiveNomineesToExNomine(
    @Body() updateNomineeStatusDto: UpdateNomineeStatusDto,
  ) {
    const result = await this.participantsService.updateNomineesToExNomine(updateNomineeStatusDto.ids);
    return {
      message: `Les nominés actifs ont été passés au statut Ex_nomine.`,
      updatedIds: result.updatedIds,
    };
  }


}
