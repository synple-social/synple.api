import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { createApplication } from '../../../helpers/create-application.helper.ts';
import request from 'supertest';
import { PasswordRequest } from '@synple/common/entities/password-request.entity';
import { Account, PasswordsService } from '@synple/common';

describe('Password reset scenarios', () => {
  const email = 'unknown@test.com';

  let app: INestApplication<App>;
  let model!: typeof PasswordRequest;
  let account!: typeof Account;

  beforeAll(async () => {
    app = await createApplication();
    model = app.get(PasswordsService).model;
    account = app.get(PasswordsService).accounts;
  });

  describe('[PWR-002] a user attemps to modify a password with an unknown email', () => {
    let response: any;

    beforeAll(async () => {
      response = request(app.getHttpServer())
        .post('/passwords/reset')
        .set('Accept', 'application/json')
        .send({
          email,
          confirmationCode: 'XYZ456',
          password: 'newPassword',
        });
    });

    it('Returns a 404 (Not Found) status code with the correct body', () => {
      return response
        .expect(404)
        .expect('Content-Type', /json/)
        .expect({ path: 'email', error: 'unknown' });
    });
  });
});
