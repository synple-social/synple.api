import { INestApplication } from "@nestjs/common";
import { CreateAccountDto } from "apps/public/src/accounts/dto/create-account.dto";
import request from 'supertest';

export function createAccount(params: CreateAccountDto, app: INestApplication) {
  return request(app.getHttpServer())
    .post('/accounts')
    .set('Accept', 'application/json')
    .send(params)
}