import { INestApplication } from '@nestjs/common';
import { createApplication } from 'apps/public/test/helpers/create-application.helper.ts';
import { App } from 'supertest/types';
import request from 'supertest';
import { accountFactory } from '../factories/account.factory';

export async function fakeLogin(): Promise<string> {
  const publicApp: INestApplication<App> = await createApplication();
  const account = await accountFactory.create(publicApp);
  const data = (
    await request(publicApp.getHttpServer())
      .post('/auth/signin')
      .set('Accept', 'application/json')
      .send({ email: account.email, password: 'password' })
  ).body;
  console.log(data);
  return data.token;
}
