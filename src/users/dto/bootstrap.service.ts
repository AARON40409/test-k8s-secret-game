// import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
// import { PrismaService } from 'prisma/prisma.service';
// import * as XLSX from 'xlsx';

// @Injectable()
// export class BootstrapService implements OnApplicationBootstrap {
//   constructor(private readonly prisma: PrismaService) {}

//   async onApplicationBootstrap() {
//     const filePath = 'src/files/listeBanque.xlsx';
//     await this.importbanquelist(filePath);
//   }

//   async importbanquelist(filePath: string) {
//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];

//     // Convertir les données en tableau JavaScript
//     const data = XLSX.utils.sheet_to_json(worksheet);
//     console.log('data :', data);
//     const bankRecords = data.map((item) => ({
//       compte: item['Code'],
//       libelle: item['Libellé'],
//       societe: item['Société'],
//       nomBanque: item['Banque'],
//       devise1: item['Devise'],
//       codeAgence: item['Code Agence'],
//       compteCompable: item['Compte comptable'],
//       devise2: item['Devise'],
//       rib: item['R I B'],
//       ribElectronique: item['R I B (Formulaire électronique)'],
//       directionExp: item[`DIRECTION D'EXP.`],
//       directionRegionale: item['DIRECTION REGIONALE'],
//       natureCompte: item['NATURE DE COMPTE'],
//       secteur: item['SECTEUR'],
//     }));
//     console.log('bankRecords :', bankRecords);

//     const result = await this.prisma.taches.createMany({
//       data: bankRecords,
//     });
//     return result;
//   }
// }
