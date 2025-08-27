// dto/vote.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty } from 'class-validator';

export class VoteDto {

  @IsNotEmpty()
  @ApiProperty()
  numeroID: number; // ID du participant nominé

 
  @IsNotEmpty()
  @ApiProperty()
  selectedParticipantId: number; // ID du participant sélectionné (celui qui vote)
}
