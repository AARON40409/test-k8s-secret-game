import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
// import { UsersModule } from './users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { ParticipantModule } from './participant/participant.module';
import { ScheduleModule } from '@nestjs/schedule';
// import { BootstrapService } from './participant/models/bootstrap.service';
// import { BootstrapService } from './participant/models/bootstrap.service';

@Module({
  imports: [
    PrismaModule,
    // UsersModule,
    // TwilioModule,
    ParticipantModule,
    MulterModule.register({ dest: './uploads' }),ScheduleModule.forRoot()
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
