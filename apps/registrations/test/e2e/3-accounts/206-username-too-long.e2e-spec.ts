import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { createPreregistration, createRegistration } from '../../http';
import { Account, AccountsService, PreRegistration, PreRegistrationsService, Registration, RegistrationsService } from '@synple/common'
import { createAccount } from '../../http/create-account.http';
import { createApplication } from '../../helpers/create-test-module.helper';

describe('Pre-registrations scenarios', () => {

  const email = "email_204@test.com"

  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createApplication()
  });

  describe('[SC-205] the username is under six characters long', () => {
    let response: any;
    let models: {
      preRegistrations?: typeof PreRegistration,
      registrations?: typeof Registration,
      accounts?: typeof Account,
    } = {}
    beforeAll(async () => {
      models.preRegistrations = app.get(PreRegistrationsService).model
      models.registrations = app.get(RegistrationsService).model
      models.accounts = app.get(AccountsService).model

      await createPreregistration(email, app)
      const preRegistration = await models.preRegistrations.findOne({ where: { email } })
      await createRegistration(email, `${preRegistration?.getDataValue('confirmationCode')}`, app)
      const registration = await models.registrations.findOne({ where: { email } })
      response = createAccount({ email, registrationId: registration?.getDataValue('uuid'), password: 'a', passwordConfirmation: 'a', username: new Array(258).join('a') }, app)
    })

    it('Returns a 400 (Bad Request) status code with the correct body', () => {
      return response
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({ path: 'username', error: 'length' })
    })
    it("Has created no account in the database", async () => {
      await response
      expect(await models.accounts?.count()).toBe(0)
    })
  })
})
