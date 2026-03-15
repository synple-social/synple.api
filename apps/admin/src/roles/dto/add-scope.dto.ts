import { ApiProperty } from "@nestjs/swagger";

export class AddScopeDto {
  @ApiProperty({
    description: 'The UUID of the scope you\'re trying to add to the current role',
    required: true,
  })
  scopeId: string
}