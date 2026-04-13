import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateBlueprintDto {
  @ApiProperty({
    description: 'The unique name the user wants to give to the blueprint',
    required: true,
  })
  @IsNotEmpty({ message: 'required' })
  name: string;

  @ApiProperty({
    description:
      'The number of slots (unit being the Eurorack HP) the module will occupy',
    required: true,
  })
  @Min(2, { message: 'minimum' })
  @IsInt({ message: 'format' })
  @IsNotEmpty({ message: 'required' })
  slots: number;
}
