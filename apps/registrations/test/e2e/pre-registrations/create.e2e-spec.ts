import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { MailerService } from '@synple/common';
import { PreRegistrationsModule } from '../../../src/pre-registrations/pre-registrations.module';
import { PreRegistrationsService } from '../../../../../libs/common/src/services/pre-registrations.service';
import { ConfigModule } from '@nestjs/config';

describe('AppController (e2e)', () => {
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

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  })

  describe('Nominal case', () => {
    let response: any;

    beforeAll(async () => {
      response = request(app.getHttpServer())
        .post('/pre-registrations')
        .set('Accept', 'application/json')
        .send({ email: 'test@example.com' })
    })

    it('Returns a 201 (Created) status code with the correct body', () => {
      return response.expect(201)
        .expect('Content-Type', /json/)
        .expect({ created: true });
    })
    describe('The created pre-registration', () => {
      it("Has created a document in the database", async () => {
        const service = app.get(PreRegistrationsService) as PreRegistrationsService
        await request(app.getHttpServer())
          .post('/pre-registrations')
          .set('Accept', 'application/json')
          .send({ email: 'test@example.com' })
          .expect(201)
          .expect('Content-Type', /json/)
          .expect({ created: true });
        const documents = await service.model.find({ email: "test@example.com", invalidated: false })
        expect(documents.length).toEqual(1)
      })
    })
  })
  describe('Alternative cases', () => {
    describe('The same email makes two consecutive requests', () => {
      it("Returns a 201 (Created) status code", async () => {
        await request(app.getHttpServer())
          .post('/pre-registrations')
          .set('Accept', 'application/json')
          .send({ email: 'test@example.com' })
        return request(app.getHttpServer())
          .post('/pre-registrations')
          .set('Accept', 'application/json')
          .send({ email: 'test@example.com' })
          .expect(201)
          .expect('Content-Type', /json/)
          .expect({ created: true });
      })
    })
    describe('There is an exception when sending the mail', () => {
      it("Returns a 201 (Created) status code and the correct body", () => {
        const mailerService = module.get(MailerService)
        jest.spyOn(mailerService, 'send').mockImplementation(() => {
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
