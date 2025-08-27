// import { Body, Controller,  Get,  Post, Req, Res  } from '@nestjs/common';
// import { ApiBadRequestResponse, ApiBody, ApiOperation, ApiParam} from '@nestjs/swagger/dist';
// import { AuthService } from './auth.service';
// import { AuthDto } from './dto/create-auth.dto';
// import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
// // import { CreateAuthDto } from './dto/create-auth.dto';
// // import { UpdateAuthDto } from './dto/update-auth.dto';
// @ApiTags('AUTH')
// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('signup')
//   // @ApiParam({name: 'id', type:'integer',description:'entrer id unique',required: true})
//   @ApiBody({schema: {
//     type: 'object',
//     properties: {
//       username: {
//         type: 'string',
//         example:'lebon11@gmail.com',
//         description:'le username est email unique'
//     },
//    password: {
//       type: 'string',
//       example:'bonjour2023',
//       description:'le mots de pass peut etre une chaine de caractere en chiffre ou en lettre'
//   }
//   }}})
//   @ApiOperation({summary: 'enregistrer un utilisateurs'})
//   @ApiCreatedResponse({description: 's\'enregistrer'})
//   signup(@Body()dto: AuthDto) {
//     return this.authService.signup(dto);
//   }

//   @Post('signin')
//   @ApiBody({schema: {
//     type: 'object',
//     properties: {
//       username: {
//         type: 'string',
//         example:'lebon11@gmail.com',
//         description:'le username est email unique'
//     },
//    password: {
//       type: 'string',
//       example:'bonjour2023',
//       description:'le mots de pass peut etre une chaine de caractere en chiffre ou en lettre'
//   }
//   }}})
//   @ApiOperation({summary: 's\'identifier avec vos coodonnées pour avoir un JWT'})
//   @ApiCreatedResponse({description: 'connect user'})
//   @ApiBadRequestResponse({description: 'erreur lors de la connection'})
//   signin(@Body() dto: AuthDto, @Req() req, @Res() res) {
//     return this.authService.signin(dto, req, res);
//   }


//   @Post('signout')
//   @ApiBody({schema: {
//     type: 'object',
//     properties: {
//       username: {
//         type: 'string',
//         example:'lebon11@gmail.com',
//         description:'utiliser le username est email unique'
//     },
//    password: {
//       type: 'string',
//       example:'bonjour2023',
//       description:'le mots de pass peut etre une chaine de caractere en chiffre ou en lettre'
//   }
//   }}})
//   @ApiOperation({summary: 'renseigner vos coordonnées pour vous deconnecter '})
//   @ApiCreatedResponse({description: 'deconnecter avec succes'})
//   signout(@Req() req, @Res() res) {
//     return this.authService.signout(req,res)
//   }


 
// }
