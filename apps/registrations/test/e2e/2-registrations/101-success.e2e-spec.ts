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
    beforeAll(async () => {
      await createPreregistration(email, app)
      models.preRegistrations = app.get(PreRegistrationsService).model
      models.registrations = app.get(RegistrationsService).model
      const { confirmationCode } = await models.preRegistrations.findOne({ email }) as PreRegistration
      response = createRegistration(email, `${confirmationCode}`, app)
    })

    it('Returns a 201 (Created) status code with the correct body', async () => {
      const firstRegistration = async () => (await models.registrations?.findOne() as RegistrationDocument)
      const { res } = await (response
        .expect(201)
        .expect('Content-Type', /application\/json/))
      expect(JSON.parse(res.text).id).toEqual((await firstRegistration()).id)
    })
  })
})
