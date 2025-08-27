
// import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
// import { Prisma } from "@prisma/client";
// import { PrismaService } from "prisma/prisma.service";
// import { EStatut } from "src/types/enum-types";

// @Injectable()
// export class BootstrapService implements OnApplicationBootstrap {
//   constructor(
//     private readonly prisma: PrismaService,
//   ) {}

//   private statuts: Prisma.statusCreateInput[] = [
//     {
//       code: EStatut.ACTIF,
//       status_title: 'actif',
//     },
//     {
//       code: EStatut.INACTIF,
//       status_title: 'inactif',
//     },
//     {
//       code: EStatut.NOMINATED,
//       status_title: 'nominé',
//     },
//     {
//       code: EStatut.NOMINATION_PENDING,
//       status_title: 'Encour de nomination',
//     }
//   ];

//   async loadStatuts() {
//     await this.prisma.status.createMany({
//       data: this.statuts,
//     });
//   }

// //   async importParticipant(filePath: string) {
// //     const nomine_liste = [];
// //     await readXlsxFile(filePath, { schema: ParticipantModels })
// //       .then(({ rows, errors }) => {
// //         if (errors.length === 0) {
// //             nomine_liste.push(...rows);
// //         }
// //       })
// //       .catch((err) => {
// //         console.log(err);
// //       });
// //     const participant = nomine_liste.map((item) => {
// //       const elt = { ...item };
// //       delete elt.idx;
// //       return elt;
// //     });
// //     const result = await this.prisma.participant.createMany({
// //         data: participant,
// //       });
// //       console.log(result);
      
// //   }

//   async onApplicationBootstrap() {

//     const count = await this.prisma.status.count();
//     if (count <= 0) {
//       await this.loadStatuts();
//     }
//     // const filePath = join(__dirname, '..','..','..','file/personnes_500.xlsx');
//     // const count = await this.prisma.participant.count();
//     // if (count <= 0) {
//     //   await this.importParticipant(filePath);
//     // }
//   }

// }