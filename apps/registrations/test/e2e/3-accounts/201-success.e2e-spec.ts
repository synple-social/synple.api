import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { createPreregistration, createRegistration } from '../../http';
import { Account, AccountsService, PreRegistration, PreRegistrationsService, Registration, RegistrationsService } from '@synple/common';
import { createAccount } from '../../http/create-account.http';
import { createApplication } from '../../helpers/create-test-module.helper';

describe('Pre-registrations scenarios', () => {

  const email = "email_001@test.com"

  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createApplication()
  });

  describe('[SC-202] the email address is not found in the database, or does not correspond to the registration UUID', () => {
    let response: any;
    let repositories: {
      preRegistrations?: typeof PreRegistration,
      registrations?: typeof Registration,
      accounts?: typeof Account,
    } = {}
    beforeAll(async () => {
      repositories.preRegistrations = app.get(PreRegistrationsService).model
      repositories.registrations = app.get(RegistrationsService).model
      repositories.accounts = app.get(AccountsService).model

      await createPreregistration(email, app)
      const preRegistration = await repositories.preRegistrations?.findOne({ where: { email } })
      await createRegistration(email, `${preRegistration?.getDataValue('confirmationCode')}`, app)
      const registration = await repositories.registrations?.findOne({ where: { email } })
      response = createAccount({
        email,
        registrationId: registration?.getDataValue('id'),
        password: 'password',
        passwordConfirmation: 'password',
        username: 'testUser'
      }, app)
    })

    it('Returns a 201 (Created) status code with the correct body', () => {
      return response
        .expect(201)
        .expect('Content-Type', /application\/json/)
        .expect({ email, username: 'testUser' })
    })
    it("Has created no account in the database", async () => {
      await response
      expect(await repositories.accounts?.count()).toBe(1)
    })
  })
})
