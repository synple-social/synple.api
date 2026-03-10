import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { createApplication } from '../../../helpers/create-application.helper.ts';
import request from 'supertest';

describe('Sign-in scenarios', () => {
  const email = 'email_001@test.com';

  let app: INestApplication<App>;
  let response: any;

  beforeAll(async () => {
    app = await createApplication();
  });

  describe('[SGI-002] the email of the user trying to sign in is not registered', () => {
    beforeAll(async () => {
      response = request(app.getHttpServer())
        .post('/auth/signin')
        .set('Accept', 'application/json')
        .send({ email, password: 'anypassword' });
    });

    it('Returns a 403 (Forbidden) status code with the correct body', () => {
      return response
        .expect(403)
        .expect('Content-Type', /application\/json/)
        .expect({ path: 'credentials', error: 'unknown' });
    });
  });
});
