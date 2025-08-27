import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNomineeStatusDto {
  @ApiProperty({
    type: [Number], 
    description: 'Liste des identifiants des nominés à mettre à jour',
    example: [1, 2, 3], 
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true }) 
  ids: number[];
}
