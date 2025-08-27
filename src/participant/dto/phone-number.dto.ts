import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({
    description: 'Numéro de téléphone du participant',
    example: '0123456789',
  })
  phone_number: string;

  @ApiProperty()
  @IsString()
  password: string;
}
