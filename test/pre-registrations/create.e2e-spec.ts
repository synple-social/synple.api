import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

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
  })
  describe('Alternative cases', () => {
    describe('The same email makes two consecutive requests', () => {

    })
    describe('There is an exception when sending the mail', () => {

    })
  })
  describe('Exception cases', () => {
    describe('The email address of the user is in an incorrect format', () => {

    })
  })
});
