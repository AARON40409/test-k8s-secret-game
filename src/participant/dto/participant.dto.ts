import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipantDto {

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file: Express.Multer.File;
}
