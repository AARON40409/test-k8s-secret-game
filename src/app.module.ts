import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
// import { UsersModule } from './users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { ParticipantModule } from './participant/participant.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TwilioModule } from 'nestjs-twilio';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OtpModule } from './twilio/twilio.module';
// import { BootstrapService } from './participant/models/bootstrap.service';
// import { BootstrapService } from './participant/models/bootstrap.service';

@Module({
  imports: [
    PrismaModule,
    // UsersModule,
    // TwilioModule,
    ParticipantModule,
    OtpModule,
    MulterModule.register({ dest: './uploads' }),ScheduleModule.forRoot(),
    TwilioModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (cfg: ConfigService) => ({
            accountSid: cfg.get('TWILIO_ACCOUNT_SID'),
            authToken: cfg.get('TWILIO_AUTH_TOKEN'),
          }),
          inject: [ConfigService],
        }),
  ],
  providers: [
    // BootstrapService,
  ]
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(PaginationMiddleware)
  //     .forRoutes({ path: '*', method: RequestMethod.GET });
  // }
}
