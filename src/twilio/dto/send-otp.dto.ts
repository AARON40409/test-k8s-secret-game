import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SendOtpDto {
    @IsNotEmpty()
    @IsPhoneNumber()
    @ApiProperty()
    phone: string;
}
