import { ApiProperty } from "@nestjs/swagger";

export class CreateRegistrationDto {
  @ApiProperty({
    example: 'foo@bar.com'
  })
  email: string
}