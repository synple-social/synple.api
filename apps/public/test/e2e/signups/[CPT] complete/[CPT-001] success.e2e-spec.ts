import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { Account } from '@synple/common';
import { createApplication } from '../../../helpers/create-application.helper.ts';
import { compare } from 'bcrypt';
import { RegistrationsFactory } from 'apps/public/test/factories/signups/registrations.factory';
import request from 'supertest';
import { isUUID } from 'class-validator';

describe('Accounts scenarios', () => {
  const email = 'email_001@test.com';

  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createApplication();
  });

  describe('[CPT-001] the account is created successfully', () => {
    let response: any;
    beforeAll(async () => {
      const registration = await RegistrationsFactory(app, {
        email,
        uuid: '1',
      });
      response = await request(app.getHttpServer())
        .post('/signups/complete')
        .set('Accept', 'application/json')
        .send({
          email,
          registrationId: registration?.getDataValue('uuid'),
          password: 'password',
          passwordConfirmation: 'password',
          username: 'testUser',
        });
    }, 20000);

    it('Returns a 201 (Created) status code with the correct body', () => {
      expect(response.status).toEqual(201)
      expect(response.body).toMatchObject({ email, username: 'testUser' });
      expect(isUUID(response.body.uuid)).toEqual(true)
    });
    it('Has created a valid account in the database', async () => {
      await response;
      expect(await app.get('AccountRepository').count()).toBe(1);
    });
    describe('The created account attributes', () => {
      let account!: Account;

      beforeAll(async () => {
        account = (await app.get('AccountRepository').findByPk(1)) as Account;
      });

      it('Has the correct registration ID', () => {
        expect(account.registrationId).toEqual(1);
      });
      it('Has the correct email address', () => {
        expect(account.email).toEqual(email);
      });
      it('Has the correct username', () => {
        expect(account.username).toEqual('testUser');
      });
      it('Can authenticate with the correct password', async () => {
        expect(await compare('password', account.passwordDigest)).toEqual(true);
      });
      it('Has an UUID later used to identify users', () => {
        expect(isUUID(account.uuid)).toEqual(true);
      });
      it('Has a JWT secret used later to generate tokens', () => {
        expect(isUUID(account.jwtSecret)).toEqual(true);
      });
    });
  });
});
