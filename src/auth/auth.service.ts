// import { BadRequestException,ForbiddenException, Injectable } from '@nestjs/common';
// import { PrismaService } from 'prisma/prisma.service';
// import { AuthDto } from './dto/create-auth.dto';
// import * as bcrypt from 'bcrypt';
// import {JwtService} from '@nestjs/jwt';
// import {jwtSecret} from '../util/constants'
// import { Request,Response } from 'express';


// @Injectable()
// export class AuthService {
//   constructor(private prisma: PrismaService, private jwt: JwtService) {}

//   //MASQUER LE MOTS DE PASS QUE L'UTILISATEUR ENREGISTRE
//   async hashPassword(password: string): Promise<string> {
//     const saltOrRounds = 10;
//  return await bcrypt.hash(password, saltOrRounds);
   
//   }
// // enregistrer un utilisateur
//   async signup(dto: AuthDto): Promise<{ message: string }> {
//     const { username, password } = dto;
//     //VERIFIER SI L'UTILISATEUR EXISTE DEJA DANS LA BASE DE DONNEE
//     const foundUser = await this.prisma.users.findUnique({ where: { username } });
//     if (foundUser) {
//       throw new BadRequestException('le username existe deja, essayer avec un autre username');
//     }
//     //creation de l'enregistrement d'un utilisateur
//     const Password = await this.hashPassword(password);
//     await this.prisma.users.create({
//         data: {
//             username,
//             Password,
//         },
//     });
//     return { message: `utilisateur ${username}enregistrer avec success` };
// }

// //creation d'une fonction pour permettre a l'utilisateur enregistrer de se connecter en comparant les mots de pass
// async comparePassword(args: {password:string, hash:string}){
//   return await bcrypt.compare(args.password,args.hash)
// }

// async signToken(args:{id:number, username:string}){
//   const payload = args
//   return this.jwt.signAsync(payload,{secret:jwtSecret})
// }

//   // async signin(dto: AuthDto,req:Request,res:Response){
//   //     const { username, password } = dto;
//   //     //VERIFIER SI L'UTILISATEUR EXISTE DEJA DANS LA BASE DE DONNEE
//   //     const foundUser = await this.prisma.users.findUnique({ where: { username } });
//   //     if (!foundUser) {
//   //         throw new BadRequestException("le username que vous essayer de connecter n'existe pas! verifier les données saisi");
//   //       }

//   //       const isMatch = await this.comparePassword({password, hash : foundUser.Password});
//   //       if (!isMatch) {
//   //           throw new BadRequestException("erreur lors de la connexion, verifier vos données saisi ")
//   //       }
        
//   //       const token = await this.signToken({
//   //           id: foundUser.id,
//   //           username:foundUser.username,
//   //       });

//   //       if (!token) {
//   //         throw new ForbiddenException()
//   //       }

//   //       res.cookie('token',token)
//   //       return{message:` utilisateur ${username} connecté avec succes` ,token}
//   //   }


//   async signin(dto: AuthDto, req: Request, res: Response) {
//     const { username, password } = dto;

//     const foundUser = await this.prisma.users.findUnique({where: {username}});

//     if (!foundUser) {
//       throw new BadRequestException(`le username que vous essayer de connecter n'existe pas! verifier les données saisi`);
//     }

//     const compareP = await this.comparePassword({password,hash: foundUser.Password,
//     });

//     if (!compareP) {
//       throw new BadRequestException('erreur lors de la connexion, verifier vos données saisi');
//     }

//     const token = await this.signToken({
//       id: foundUser.id,
//       username: foundUser.username,
//     });

//     if (!token) {
//       throw new ForbiddenException('connexion impossible');
//     }

//     res.cookie('token', token, {});

//     return res.send({ message:` utilisateur ${username} connecté avec succes`, token});
//   }


// //deconnecter un utilisateur
//     async signout(req: Request, res:Response) {
//       res.clearCookie('token')
//       return res.send({message: 'deconnecter avec succes'})
      
//     }


// }
