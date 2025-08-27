import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ParticipantIdDto {
  @IsNumber()
  @ApiProperty()
   participant_id: number ;
}
