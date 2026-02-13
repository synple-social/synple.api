import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { PreRegistrationsModule } from '../../../../src/pre-registrations/pre-registrations.module';
import { PreRegistrationsService } from '../../../../../../libs/common/src/services/pre-registrations.service';
import { ConfigModule } from '@nestjs/config';
import { PreRegistration, Registration } from '@synple/models';
import { Model } from 'mongoose';
import { createPreregistration, createRegistration } from '../../../http';
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
    let model: Model<Registration>
    beforeAll(async () => {
      await createPreregistration(email, app)
      model = app.get(RegistrationsService).model
      response = createRegistration(email, "confirmation code not matching", app)
    })

    it('Returns a 404 (Not Found) status code with the correct body', () => {
      return response
        .expect(404)
        .expect('Content-Type', /application\/json/)
        .expect({ path: 'email', error: 'unknown' })
    })
    it("Has created no registration in the database", async () => {
      await response
      expect(await model.countDocuments()).toBe(0)
    })
  })
})
