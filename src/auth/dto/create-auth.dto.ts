import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,IsString,IsEmail } from "class-validator";
export class AuthDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    username: string
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string

}
