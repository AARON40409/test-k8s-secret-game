import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { HealthController } from './health.controller';
// import { SmsService } from 'src/twilio/twilio.service';

@Module({
  controllers: [ParticipantController, HealthController],
  providers: [ParticipantService]
})
export class ParticipantModule {}
