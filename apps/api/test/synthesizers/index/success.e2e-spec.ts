import { createApplication } from '../../helpers/create-application.helper';
import { signin } from '../../helpers/signin.helper';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

describe('GET /synthesizers', () => {
  let app!: INestApplication;

  const email = 'test@test.com';
  const username = 'TestUser';
  const password = 'password';

  let response!: any;

  beforeAll(async () => {
    app = await createApplication();
    const { token } = await signin(app, { email, username, password });

    response = await request(app.getHttpServer())
      .get('/synthesizers')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
  });

  it('Returns a 200 (OK) status code with the correct body', () => {
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([]);
  });
});
