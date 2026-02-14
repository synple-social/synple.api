import { INestApplication } from "@nestjs/common";
import request from 'supertest';

export function createAccount(email: string, registrationId: string, app: INestApplication) {
  return request(app.getHttpServer())
    .post('/accounts')
    .set('Accept', 'application/json')
    .send({ email, registrationId })
}