import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { MailerService, PreRegistrationsService } from '@synple/common';
import { PreRegistrationsModule } from '../../../src/pre-registrations/pre-registrations.module';
import { ConfigModule } from '@nestjs/config';
import supertest from 'supertest';
import { Model } from 'mongoose';
import { PreRegistration } from '@synple/models';

describe('Pre registrations scenarios', () => {
  let module: TestingModule;
  let app: INestApplication<App>;

  const email = 'test_003@mail.com'

  beforeAll(async () => {
    module = await Test.createTestingModule({ imports: [
      ConfigModule.forRoot({ envFilePath: '.env.test.local' }),
      PreRegistrationsModule
    ] }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  
  describe('[SC-003] There is an unknown error happening when a user attemps to make a pre registration creation', () => {
    let response: supertest.Test
    let model: Model<PreRegistration>

    beforeAll(() => {
      const mailerService = module.get(MailerService)
      jest.spyOn(mailerService, 'send').mockImplementation(() => {
        throw new Error('test error')
      })
      response = request(app.getHttpServer())
        .post('/pre-registrations')
        .set('Accept', 'application/json')
        .send({ email })
      model = app.get(PreRegistrationsService).model

      jest.clearAllMocks();
      jest.resetAllMocks();
    })
    it("Returns a 201 (Created) status code and the correct body", () => {
      return response
        .expect(201)
        .expect('Content-Type', /json/)
        .expect({ created: true });
    })
    it("Has created a valid pre registration for this email address", async () => {
      expect(await model.countDocuments({ email, invalidated: false })).toBe(1)
    })
    it("Has not set the sentAt timestamp as the email has not been sent", async () => {
      expect((await model.findOne({ email }))?.sentAt).toBeUndefined()
    })
  })
});
