import { ApiProperty } from "@nestjs/swagger";
import { IsString,IsNotEmpty } from "class-validator"

export class CreateUserDto {
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    firstname : string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    lastname : string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    indice : string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description : string
}

