import { INestApplication } from "@nestjs/common";
import { SignupsCompleteDto } from "apps/public/src/signups/dto/signups-complete.dto";
import request from 'supertest';

export function createAccount(params: SignupsCompleteDto, app: INestApplication) {
  return request(app.getHttpServer())
    .post('/signups/complete')
    .set('Accept', 'application/json')
    .send(params)
}