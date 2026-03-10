import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export function createPreregistration(email: string, app: INestApplication) {
  return request(app.getHttpServer())
    .post('/signups/pre-register')
    .set('Accept', 'application/json')
    .send({ email });
}
