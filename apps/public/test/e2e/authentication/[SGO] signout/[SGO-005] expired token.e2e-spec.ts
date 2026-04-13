import { INestApplication } from '@nestjs/common';
import { AccountsService, TokensService } from '@synple/common';
import { createApplication } from 'apps/public/test/helpers/create-application.helper.ts';
import request from 'supertest';
import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';

const TWO_DAYS = 172_800_000;

describe('Signing out of the application', () => {
  const email = 'test@email.com';

  let app: INestApplication;
  let response: any;
  let service: TokensService;

  beforeAll(async () => {
    app = await createApplication();
  });
  describe('[SCO-005] the user tries to log our with an already expired JWT', () => {
    beforeAll(async () => {
      jest
        .useFakeTimers()
        .setSystemTime(new Date(new Date().getTime() - TWO_DAYS));

      service = await app.get(TokensService);
      const accounts = app.get(AccountsService).model;
      await accounts.create({
        email,
        uuid: uuid(),
        username: 'TestUser',
        passwordDigest: await hash('password', 1),
      });
      const jwt = await service.create(email, 'password');

      jest.clearAllMocks();
      jest.resetAllMocks();

      response = await request(app.getHttpServer())
        .post(`/auth/signout`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt}`);
    });
    it('Returns a 204 (No Content) with a message expliciting the error', async () => {
      expect(response.status).toEqual(204);
    });
    it('Has invalidated the token to ensure it cannot be used in further requests', async () => {
      expect(await service.model.scope('invalid').count({})).toBe(1);
    });
  });
});
