import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { PreRegistrationsModule } from '../../../src/pre-registrations/pre-registrations.module';
import { PreRegistrationsService } from '../../../../../libs/common/src/services/pre-registrations.service';
import { ConfigModule } from '@nestjs/config';
import { PreRegistration, Registration, RegistrationDocument } from '@synple/models';
import { Model } from 'mongoose';
import { createPreregistration, createRegistration } from '../../http';
import { RegistrationsModule } from 'apps/registrations/src/registrations/registrations.module';
import { RegistrationsService } from '@synple/common';
import { createAccount } from '../../http/create-account.http';
import { Account } from '@synple/models/account.model';
import { AccountsModule } from 'apps/registrations/src/accounts/accounts.module';
import { AccountsService } from '@synple/common/services/accounts.service';

describe('Pre-registrations scenarios', () => {

  const email = "email_001@test.com"

  let module: TestingModule;
  let app: INestApplication<App>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.test.local' }),
        PreRegistrationsModule,
        RegistrationsModule,
        AccountsModule
      ]
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  describe('[SC-202] the email address is not found in the database, or does not correspond to the registration UUID', () => {
    let response: any;
    let models: {
      preRegistrations?: Model<PreRegistration>,
      registrations?: Model<Registration>
      accounts?: Model<Account>
    } = {}
    beforeAll(async () => {
      models.preRegistrations = app.get(PreRegistrationsService).model
      models.registrations = app.get(RegistrationsService).model
      models.accounts = app.get(AccountsService).model

      await createPreregistration(email, app)
      const { confirmationCode } = await models.preRegistrations.findOne({ email }) as PreRegistration
      await createRegistration(email, `${confirmationCode}`, app)
      const { id: registrationId } = await models.registrations.findOne({ email }) as RegistrationDocument
      response = createAccount({
        email: 'invalid:@email.com', registrationId, password: 'a', passwordConfirmation: 'a', username: 'testUser'
      }, app)
    })

    it('Returns a 404 (Not Found) status code with the correct body', () => {
      return response
        .expect(404)
        .expect('Content-Type', /application\/json/)
        .expect({ path: 'email', error: 'unknown' })
    })
    it("Has created no account in the database", async () => {
      await response
      expect(await models.accounts?.countDocuments()).toBe(0)
    })
  })
})
