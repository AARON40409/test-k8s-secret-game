import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class UpdateNomineeDto {
  @ApiProperty({ description: 'ID du participant', type: Number })
  @IsNotEmpty()
  participantId: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'Indice du nominé', type: String })
  indice: string;
}

export class UpdateNomineesDto {
  @ApiProperty({ type: [UpdateNomineeDto], description: 'Liste des nominés à mettre à jour' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateNomineeDto)
  nominees: UpdateNomineeDto[];
}
