import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of the role you want to create',
    example: 'Nice role name',
    required: true,
  })
  @IsNotEmpty({ message: 'required' })
  name: string;

  @ApiProperty({
    description:
      'TRUE to indicate that this group will become the default group, FALSE otherwise. Use carefully as it will influence the behaviour of the subscription.',
    example: false,
  })
  @IsBoolean({ message: 'format' })
  isDefault: boolean;
}
