import { ApiProperty } from '@nestjs/swagger';

export class SignupsCompleteDto {
  @ApiProperty({
    description:
      'The email address used throughout the whole subscription process',
    example: 'foo@bar.com',
  })
  email: string;

  @ApiProperty({
    description:
      'The UUID of the registration that the user previously created',
    example: '019c8cd8-afbf-70f8-a572-2b9ed9e75590',
  })
  registrationId: string;

  @ApiProperty({
    description:
      "The user's display name that will be out to see for other users and identify them",
    example: 'GreatUsername',
  })
  username: string;

  @ApiProperty({
    description:
      'The password used to identify the user when logging in. Will NOT be saved on our side',
    example: 'SecureANDLongPassword123?!',
  })
  password: string;

  @ApiProperty({
    description:
      'The password confirmation, used in the frontend to ensure that the user has typed the correct value. MUST be equal to password.',
    example: 'SecureANDLongPassword123?!',
  })
  passwordConfirmation: string;
}
