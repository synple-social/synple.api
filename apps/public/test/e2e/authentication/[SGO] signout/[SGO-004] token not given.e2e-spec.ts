import { INestApplication } from '@nestjs/common';
import { createApplication } from 'apps/public/test/helpers/create-application.helper.ts';
import request from 'supertest';

describe('Signing out of the application', () => {
  let app: INestApplication;
  let response: any;

  beforeAll(async () => {
    app = await createApplication();
  });
  describe('[SCO-004] the user tries to log out without providing a JWT', () => {
    beforeAll(async () => {
      response = request(app.getHttpServer())
        .post(`/auth/signout`)
        .set('Accept', 'application/json')
        .end();
    });
    it('Returns a 400 (Bad Request) with a message expliciting the error', async () => {
      response
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({ path: 'token', error: 'required' });
    });
  });
});
