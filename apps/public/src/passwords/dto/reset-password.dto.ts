import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description:
      'The email address that was used to request the password reset',
    example: 'foo@bar.com',
  })
  @IsEmail({}, { message: 'format' })
  @IsNotEmpty({ message: 'required' })
  email: string;

  @ApiProperty({
    description:
      'The six-characters long confirmation code that was sent via email to confirm your identity',
    example: 'ABC123',
  })
  @IsNotEmpty({ message: 'required' })
  confirmationCode: string;

  @ApiProperty({
    description:
      'The new password the user wants to use for further authentications',
    example: 'SuperStrongPassword',
  })
  @IsNotEmpty({ message: 'required' })
  password: string;

  @ApiProperty({
    description:
      'The confirmation of the password, used to detect typos when typing it.',
    example: 'SuperStrongPassword',
  })
  @IsNotEmpty({ message: 'required' })
  passwordConfirmation: string;
}
