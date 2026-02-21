import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class CreatePreRegistrationDto {
  @ApiProperty({
    example: 'foo@bar.com',
    description: 'The email address where the subscription confirmation will be sent. Must be valid, and accessible by the user.'
  })
  @IsEmail()
  email: string
}