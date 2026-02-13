import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { PreRegistrationsModule } from '../../../src/pre-registrations/pre-registrations.module';
import { PreRegistrationsService } from '../../../../../libs/common/src/services/pre-registrations.service';
import { ConfigModule } from '@nestjs/config';
import { PreRegistration } from '@synple/models';
import { Model } from 'mongoose';
import { createPreregistration } from '../../http/create-pre-registration.http';

describe('Pre-registrations scenarios', () => {

  const email = "email_001@test.com"

  let module: TestingModule;
  let app: INestApplication<App>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.test.local' }),
        PreRegistrationsModule
      ]
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  describe('[SC-001] a pre registration is created successfully', () => {
    let response: any;

    beforeAll(async () => {
      response = createPreregistration(email, app)
    })

    it('Returns a 201 (Created) status code with the correct body', () => {
      return response
        .expect(201)
        .expect('Content-Type', /application\/json/)
        .expect({ created: true });
    })
    describe('The created pre-registration', () => {
      let preRegistration: PreRegistration | null

      beforeAll(async () => {
        const model: Model<PreRegistration> = app.get(PreRegistrationsService).model
        preRegistration = await model.findOne({ email, invalidated: false })
      })

      it("Has created a document in the database", () => {
        expect(preRegistration).not.toBe(null)
      })
      it("Has created a document with a confirmation code", () => {
        expect(preRegistration?.confirmationCode).toMatch(/^[A-Z0-9]{6}$/)
      })
    })
  })
})
