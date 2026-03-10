import { ApiProperty } from '@nestjs/swagger';

export class SignupsRegisterDto {
  @ApiProperty({
    example: 'foo@bar.com',
    description:
      'The email that was previously used to created the pre-registration',
  })
  email: string;
  @ApiProperty({
    example: 'FBH6D2',
    description:
      'The confirmation code that was received in the confirmation email',
  })
  confirmationCode: string;
}
