import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PreRegistrationsModule } from '../../../src/pre-registrations/pre-registrations.module';
import { ConfigModule } from '@nestjs/config';

describe('Pre-registrations scenarios', () => {
  let module: TestingModule;
  let app: INestApplication<App>;

  beforeAll(async () => {
    module = await Test.createTestingModule({ imports: [
      ConfigModule.forRoot({ envFilePath: '.env.test.local' }),
      PreRegistrationsModule
    ] }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  
  describe('[SC-004] a pre registration creation attempt with an invalid format email', () => {
    it("Returns a 400 (Bad Request) status code and the correct body", () => {
      return request(app.getHttpServer())
        .post('/pre-registrations')
        .set('Accept', 'application/json')
        .send({ email: 'invalid value' })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({ path: 'email', error: 'regexp' });
    })
  })
})
