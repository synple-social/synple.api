import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { createAccount } from '../../../http/create-account.http';
import { createApplication } from '../../../helpers/create-application.helper.ts';

describe('Accounts scenarios', () => {
  const email = 'email_001@test.com';

  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createApplication();
  });

  describe('[CPT-001] the account is created successfully', () => {
    let response: any;

    beforeAll(async () => {
      response = createAccount(
        {
          email,
          username: 'GreatUsername',
          registrationId: 'random_uuid',
          password: 'password',
        },
        app,
      );
    });

    it('Returns a 400 (Bad Request) status code with the correct body', () => {
      return response
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({ path: 'passwordConfirmation', error: 'required' });
    });
  });
});
