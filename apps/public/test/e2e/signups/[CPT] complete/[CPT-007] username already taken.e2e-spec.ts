import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import {
  Account,
  PreRegistration,
  PreRegistrationsService,
  Registration,
  RegistrationsService,
} from '@synple/common';
import { createPreregistration, createRegistration } from '../../../http';
import { createAccount } from '../../../http/create-account.http';
import { createApplication } from '../../../helpers/create-application.helper.ts';

describe('Accounts scenarios', () => {
  const email = 'email_204@test.com';

  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createApplication();
  });

  describe('[CPT-007] the username is already used by another user', () => {
    let response: any;
    let models: {
      preRegistrations?: typeof PreRegistration;
      registrations?: typeof Registration;
      accounts?: typeof Account;
    } = {};
    beforeAll(async () => {
      models.preRegistrations = app.get(PreRegistrationsService).model;
      models.registrations = app.get(RegistrationsService).model;
      models.accounts = app.get('AccountsService').model;

      await createPreregistration(email, app);
      await createRegistration(email, 'ABC123', app);
      const registration = await models.registrations.findOne({
        where: { email },
      });
      const username = 'testUser';
      await createAccount(
        {
          email,
          registrationId: registration?.getDataValue('uuid'),
          password: 'a',
          passwordConfirmation: 'a',
          username,
        },
        app,
      );

      await createPreregistration(email, app);
      const secondPreRegistration = await models.preRegistrations.findOne({
        where: { email },
      });
      await createRegistration(
        email,
        `${secondPreRegistration?.getDataValue('confirmationCode')}`,
        app,
      );
      const secondRegistration = await models.registrations.findOne({
        where: { email },
      });
      response = createAccount(
        {
          email,
          registrationId: secondRegistration?.getDataValue('uuid'),
          password: 'a',
          passwordConfirmation: 'a',
          username,
        },
        app,
      );
    }, 20000);

    it('Returns a 400 (Bad Request) status code with the correct body', async () => {
      return response
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({ path: 'username', error: 'unique' });
    });
    it('Has created one account in the database', async () => {
      expect(await models.accounts?.count()).toBe(1);
    });
    it('Has created the first account but not the second one', async () => {
      expect(
        (await models.accounts?.findOne({ where: { username: 'testUser' } }))
          ?.dataValues.email,
      ).toEqual(email);
    });
  });
});
