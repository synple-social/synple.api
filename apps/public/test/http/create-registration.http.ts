import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export function createRegistration(
  email: string,
  confirmationCode: string,
  app: INestApplication,
) {
  return request(app.getHttpServer())
    .post('/signups/register')
    .set('Accept', 'application/json')
    .send({ email, confirmationCode });
}
