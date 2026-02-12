import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { PreRegistrationsModule } from '../../../src/pre-registrations/pre-registrations.module';
import { ConfigModule } from '@nestjs/config';
import { createPreregistration } from '../../http/create-pre-registration.http';
import { PreRegistrationsService } from '@synple/common';
import { Model } from 'mongoose';
import { PreRegistration } from '@synple/models';

describe('Pre registrations scenarios', () => {
  let module: TestingModule;
  let app: INestApplication<App>;
  const email = 'test_002@mail.com'

  beforeAll(async () => {
    module = await Test.createTestingModule({ imports: [
      ConfigModule.forRoot({ envFilePath: '.env.test.local' }),
      PreRegistrationsModule
    ] }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  
  describe('[SC-002] a soon-to-be user makes two consecutive pre registration creation attempts with the same email address', () => {
    let lastResponse: any
    let model: Model<PreRegistration>
    beforeAll(() => {
      createPreregistration(email, app).end()
      lastResponse = createPreregistration(email, app)
      model = app.get(PreRegistrationsService).model
    })
    it("Returns a 201 (Created) status code", async () => {
      return lastResponse
        .expect(201)
        .expect('Content-Type', /json/)
        .expect({ created: true });
    })
    it("Has created only two pre registrations", async () => {
      expect(await model.countDocuments({ email })).toBe(2)
    })
    it("Has created one invalidated pre registration", async () => {
      expect(await model.countDocuments({ email, invalidated: true })).toBe(1)
    })
    it("Has created one valid pre registration", async () => {
      expect(await model.countDocuments({ email, invalidated: false })).toBe(1)
    })
    it("Has created the invalidated pre registration before the valid one", async () => {
      const invalidated = await model.findOne({ email, invalidated: true })
      const valid = await model.findOne({ email, invalidated: false })
      expect(invalidated?.createdAt?.getTime() || 0).toBeLessThan(valid?.createdAt?.getTime() || Number.NEGATIVE_INFINITY)
    })
  })
})
