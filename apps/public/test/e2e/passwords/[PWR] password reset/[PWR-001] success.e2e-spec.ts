import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { createApplication } from '../../../helpers/create-application.helper.ts';
import request from 'supertest';
import { PasswordRequest } from '@synple/common/entities/password-request.entity';
import { Account, PasswordsService } from '@synple/common';
import { compare, hash } from 'bcrypt';

describe('Password reset scenarios', () => {
  const email = 'email_001@test.com';

  let app: INestApplication<App>;
  let model!: typeof PasswordRequest;
  let account!: typeof Account;

  beforeAll(async () => {
    app = await createApplication();
    model = app.get(PasswordsService).model;
    account = app.get(PasswordsService).accounts;
  });

  describe('[PWR-001] the password is successfully reset', () => {
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
          email,
          confirmationCode: 'ABC123',
          password: 'newPassword',
          passwordConfirmation: 'newPassword',
        });
    });

    it('Returns a 204 (No Content) status code with the correct body', () => {
      return response.expect(204);
    });
    test('The password that has been reset on the account', async () => {
      const digest = (await account.findOne({ where: { email } }))
        ?.passwordDigest;
      const result = await compare('newPassword', digest);
      expect(result).toEqual(true);
    });
  });
});
