import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"

export class AuthSigninDto {
  @ApiProperty({
    description:
      "The email address used to identify the user while signing in.",
    example: "foo@bar.com",
    required: true,
  })
  @IsEmail({}, { message: 'format' })
  @IsNotEmpty({ message: 'required' })
  email: string

  @ApiProperty({
    description: "The password used to authenticate the user while signing in.",
    example: "SuperStrongPassword",
    required: true,
  })
  @IsNotEmpty({ message: 'required' })
  password: string
}