/**
 * The flow is :
 * 1. a user creates a pre-registration
 * 2. the user validates the pre-registration correctly, thus creating a registration
 * 3. the user creates another pre-registration with the same email (supposedly closed and reopened the frontend app)
 * 4. the user confirms this second pre-registration
 * 
 * result should be that the first registration is returned on the second call as it is still valid.
 */

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

async function getLastConfirmationCode(email: string, model: Model<PreRegistration>): Promise<string> {
  return `${(await model.find({ email }).sort({ createdAt: -1 }).findOne() as PreRegistration).confirmationCode}`
}

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
      ]
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  describe('[SC-001] a pre registration is created successfully', () => {
    let response: any;
    let models: {
      preRegistrations?: Model<PreRegistration>,
      registrations?: Model<Registration>
    } = {}
    const codes: string[] = []
    beforeAll(async () => {
      await createPreregistration(email, app)
      models.preRegistrations = app.get(PreRegistrationsService).model
      models.registrations = app.get(RegistrationsService).model
      codes.push(await getLastConfirmationCode(email, models.preRegistrations))
      await createRegistration(email, codes[0], app)
      await createPreregistration(email, app)
      codes.push(await getLastConfirmationCode(email, models.preRegistrations))
      response = createRegistration(email, codes[1], app)
    })

    it('Returns a 201 (Created) status code with the correct body', async () => {
      const firstRegistration = async () => (await models.registrations?.findOne() as RegistrationDocument)
      const { res } = await (response
        .expect(201)
        .expect('Content-Type', /application\/json/))
      expect(JSON.parse(res.text).id).toEqual((await firstRegistration()).id)
    })
    it("Has correctly created one invalidated pre-registration for this email address", async () => {
      expect(await models.preRegistrations?.countDocuments({ email, invalidated: true })).toBe(1)
    })
    it("Has correctly created one valid pre-registration for this email address", async () => {
      expect(await models.preRegistrations?.countDocuments({ email, invalidated: false })).toBe(1)
    })
    it("Has created only one registration", async () => {
      expect(await models.registrations?.countDocuments({ email })).toBe(1)
    })
  })
})
