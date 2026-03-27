import { TokensService } from '@synple/common';
import { accountFactory } from '../../factories/account.factory';
import { createApplication } from '../../helpers/create-application.helper';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { SynthesizersModule } from 'apps/api/src/synthesizers/synthesizers.module';

describe('GET /synthesizers', () => {
  let app!: INestApplication;
  let response!: any;

  beforeAll(async () => {
    app = await createApplication({ module: SynthesizersModule });
    
    const account = await accountFactory.create(app)
    const token = await app.get(TokensService).create(account.email, "password")

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
