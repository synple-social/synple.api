import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { createApplication } from '../../../helpers/create-application.helper.ts';
import request from 'supertest';
import { PasswordRequest } from '@synple/common/entities/password-request.entity';
import { PasswordsService } from '@synple/common';
import { hash } from 'bcrypt';

describe('Password reset requests scenarios', () => {
  const email = 'email_001@test.com';

  let app: INestApplication<App>;
  let model!: typeof PasswordRequest;

  beforeAll(async () => {
    app = await createApplication();
    model = app.get(PasswordsService).model;
  });

  describe('[PWQ-001] the password reset request is created successfully', () => {
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
        .send({ email });
    });

    it('Returns a 201 (Created) status code with the correct body', () => {
      return response
        .expect(201)
        .expect('Content-Type', /application\/json/)
        .expect({ created: true });
    });
    describe('The created password reset request', () => {
      let passwordRequest!: PasswordRequest;

      beforeAll(async () => {
        passwordRequest = (await model.findByPk(1)) as PasswordRequest;
      });

      it('Has the correct email address', () => {
        expect(passwordRequest.dataValues.email).toEqual(email);
      });
      it('Has the correct confirmation code', () => {
        expect(passwordRequest.dataValues.confirmationCode).toEqual('ABC123');
      });
    });
  });
});
