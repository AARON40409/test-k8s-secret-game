// import { Body, Controller, Get, Param, Post} from '@nestjs/common';
// import {ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger/dist';
// import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import HttpResponse from 'src/response/response';
// @ApiTags('USERS')
// @Controller('users')
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

  // @Post('/sign-up')
  // @ApiResponse({
  //   status: 201,
  //   description: "Création d'un utilisateur",
  // })
  // @ApiOperation({summary: 'cree les utilisateurs'})
  // getUsers(@Body() input: CreateUserDto){
  //   const message = 'Utilisateur connecté avec succès';
  //   console.log('input:',input);
  //   return HttpResponse.send(
  //     this.usersService.createUsers(input),
  //     message,
  //   );
  // }

//   // @Get(':id')
//   // @ApiResponse({
//   //   status: 200,
//   //   description: "Recherche d'un utilisateur",
//   // })
//   // @ApiOperation({summary: 'Rechercher un utilisateur par son id'})
//   // findById(@Param('id') id: string){
//   //   const message = 'Opération effectuée avec succès';
//   //   return HttpResponse.send(
//   //     this.usersService.findById(id),
//   //     message,
//   //   );
//   // }


//   // @Get()
//   // @ApiResponse({
//   //   status: 200,
//   //   description: "Rechercher tous les user",
//   // })
//   // @ApiOperation({summary: 'Rechercher tous les user'})
//   // getAllNomine(){
//   //   const message = 'Opération effectuée avec succès';
//   //   return HttpResponse.send(
//   //     this.usersService.getAllUser(),
//   //     message,
//   //   );
//   // }


// }
