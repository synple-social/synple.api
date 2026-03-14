import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, Matches } from "class-validator"

export class CreateScopeDto {
  @Matches(/^[a-z]+(::[a-z]+)*$/, { message: 'format'})
  @IsNotEmpty({ message: 'required'})
  @ApiProperty({
    description: 'The slug identifying this scope in the routes of the application',
    example: 'test::scope',
    required: true,
  })
  slug: string

  @ApiProperty({
    description: 'The description used to display in the interface, more readable than the slug.',
    example: 'Example description for the scope'
  })
  description?: string
}