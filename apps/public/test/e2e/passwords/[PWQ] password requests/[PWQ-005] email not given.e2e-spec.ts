import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { createApplication } from '../../../helpers/create-application.helper.ts';
import request from 'supertest';
import { PasswordsService } from '@synple/common';
import { hash } from 'bcrypt';

describe('Password reset requests scenarios', () => {
  const email = 'email_001@test.com';

  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createApplication();
  });

  describe('[PWQ-005] the user did not provide an email address while requesting for a password reset', () => {
    let response: any;

    beforeAll(async () => {
      const account = app.get(PasswordsService).accounts;
      await account.create({
        email,
        passwordDigest: await hash('password', 1),
        uuid: '1',
        username: 'testuser',
      });
      response = request(app.getHttpServer())
        .post('/passwords/request')
        .set('Accept', 'application/json')
        .send({});
    });

    it('Returns a 400 (Bad Request) status code with the correct body', () => {
      return response
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({ path: 'email', error: 'required' });
    });
  });
});
