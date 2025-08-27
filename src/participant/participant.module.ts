import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
// import { SmsService } from 'src/twilio/twilio.service';

@Module({
  controllers: [ParticipantController],
  providers: [ParticipantService]
})
export class ParticipantModule {}
