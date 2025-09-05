import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import*as cookieParser from 'cookie-parser';
import { DocumentBuilder,SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './interceptor/interceptor';
import { API_PREFIX } from './util/constants';
import { Response } from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://secret-game.everest-consulting.org',
      'http://localhost:4200',
      'http://localhost:3000',
      'http://localhost:5200',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe ({transform: true,whitelist:true}));
  app.use(cookieParser())
  const config = new DocumentBuilder()
  .setTitle('Secret Game')
  .setDescription('Secret Game API Documentation')
  .setVersion('1.0')
  .addBearerAuth({type:'http',scheme:'bearer', bearerFormat:'JWT',name:'JWT',description:'Entrer un jeton JWT',in: 'header'}, 'access-token')
  .build()
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api', app, document)

  // await app.listen(5000);
  app.getHttpAdapter().get('', (req, res: Response) => {
    res.redirect(`${API_PREFIX}/docs`);
  });

  app.enableShutdownHooks();
  const port = process.env.PORT ?? 3000;

  await app.listen(port);
  Logger.log(`Application started on port ${port}`);
}
bootstrap();
