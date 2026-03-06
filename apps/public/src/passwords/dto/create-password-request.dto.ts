import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class CreatePasswordRequestDto {
  @ApiProperty({
    example: 'foo@bar.com',
    description: 'The email address where the password request will be sent. Must be valid, and accessible by the user.'
  })
  @IsEmail()
  email: string
}