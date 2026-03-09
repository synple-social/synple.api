import { ApiProperty } from "@nestjs/swagger"

export class AuthSigninDto {
  @ApiProperty({
    description:
      "The email address used to identify the user while signing in.",
    example: "foo@bar.com",
    required: true,
  })
  email: string
  @ApiProperty({
    description: "The password used to authenticate the user while signing in.",
    example: "SuperStrongPassword",
    required: true,
  })
  password: string
}