import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { createApplication } from '../../../helpers/create-application.helper.ts';
import request from 'supertest';
import { Account, PasswordsService } from '@synple/common';
import { hash } from 'bcrypt';

describe('Password reset scenarios', () => {
  const email = 'email_001@test.com';

  let app: INestApplication<App>;
  let account!: typeof Account;

  beforeAll(async () => {
    app = await createApplication();
    account = app.get(PasswordsService).accounts;
  });

  describe('[PWR-005] the user did not provide an email address', () => {
    let response: any;

    beforeAll(async () => {
      await account.create({
        email,
        passwordDigest: await hash('password', 1),
        uuid: '1',
        username: 'testuser',
      });

      await request(app.getHttpServer())
        .post('/passwords/request')
        .set('Accept', 'application/json')
        .send({ email });
      response = request(app.getHttpServer())
        .post('/passwords/reset')
        .set('Accept', 'application/json')
        .send({
          confirmationCode: 'ABC123',
          password: 'newPassword',
          passwordConfirmation: 'newPassword',
        });
    });

    it('Returns a 204 (No Content) status code with the correct body', () => {
      return response
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({ path: 'email', error: 'required' });
    });
  });
});
