import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';

export class VerifyOtpDto {
    @IsNotEmpty()
    @ApiProperty()
    @IsPhoneNumber()
    phone: string;

    @IsNotEmpty()
    @ApiProperty()
    @Length(4, 6)
    code: string;
}
