import { ApiProperty } from "@nestjs/swagger";

export class CreateRegistrationDto {
  @ApiProperty({
    example: 'foo@bar.com'
  })
  email: string
  @ApiProperty({
    example: 'FBH6D2'
  })
  confirmationCode: string
}