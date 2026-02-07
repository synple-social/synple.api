import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { MailerService } from '../../src/shared/services/mailer.service';
import { vi, describe, it, beforeEach, afterEach } from 'vitest';

describe('AppController (e2e)', () => {
  let module: TestingModule;
  let app: INestApplication<App>;

  beforeEach(async () => {
    module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  })

  describe('Nominal case', () => {
    it('Returns a 201 (Created) status code with the correct body', () => {
      return request(app.getHttpServer())
        .post('/pre-registrations')
        .set('Accept', 'application/json')
        .send({ email: 'test@example.com' })
        .expect(201)
        .expect('Content-Type', /json/)
        .expect({ created: true });
    })
    // describe('The created pre-registration', () => {
    // })
  })
  describe('Alternative cases', () => {
    // describe('The same email makes two consecutive requests', () => {

    // })
    describe('There is an exception when sending the mail', () => {
      it("Returns a 201 (Created) status code and the correct body", () => {
        const mailerService = module.get(MailerService)
        vi.spyOn(mailerService, 'send').mockImplementation(() => {
          throw new Error('test error')
        })
        return request(app.getHttpServer())
          .post('/pre-registrations')
          .set('Accept', 'application/json')
          .send({ email: 'test@example.com' })
          .expect(201)
          .expect('Content-Type', /json/)
          .expect({ created: true });
      })
    })
  })
  describe('Exception cases', () => {
    describe('The email address of the user is in an incorrect format', () => {
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
});
