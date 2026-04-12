import { ApiProperty } from "@nestjs/swagger"

export class CreateBlueprintDto {
  @ApiProperty({
    description: 'The unique name the user wants to give to the blueprint',
    required: true
  })
  name: string

  @ApiProperty({
    description: 'The number of slots (unit being the Eurorack HP) the module will occupy',
    required: true
  })
  slots: number
}