import { INestApplication } from '@nestjs/common';
import { AccountsService, TokensService } from '@synple/common';
import { createApplication } from 'apps/public/test/helpers/create-application.helper.ts';
import request from 'supertest';
import { hash } from 'bcrypt';

describe('Signing out of the application', () => {
  const email = 'test@email.com';

  let app: INestApplication;
  let response: any;

  beforeAll(async () => {
    app = await createApplication();
  });
  describe('[SCO-003] a user makes two successive calls on the log out route with the same token', () => {
    beforeAll(async () => {
          const accounts = app.get(AccountsService).model;
      await accounts.create({
        email,
        uuid: '1',
        username: 'TestUser',
        passwordDigest: await hash('password', 1),
      });
      const token = await app.get(TokensService).create(email, 'password');
      await request(app.getHttpServer())
        .post(`/auth/signout`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      response = request(app.getHttpServer())
        .post(`/auth/signout`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .end();
    });
    it('Returns a 204 (No Content) with a message expliciting the error', async () => {
      response.expect(204).expect('Content-Type', /application\/json/);
    });
  });
});
