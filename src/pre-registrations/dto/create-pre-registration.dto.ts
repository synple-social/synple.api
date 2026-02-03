import { ApiProperty } from "@nestjs/swagger";

export class CreatePreRegistrationDto {
  @ApiProperty()
  email: string
}