import { INestApplication } from '@nestjs/common';
import { createApplication } from '../helpers/create-application.helper';
import request from 'supertest';
import { ScopesService } from '@synple/common/services/admin/scopes.service';

describe('Scopes', () => {
  let app!: INestApplication;

  beforeAll(async () => {
    app = await createApplication();
  });

  describe('Nominal case', () => {
    let response!: any;

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .get('/scopes')
        .set('Accept', 'application/json');
    });

    it('Returns a 200 (OK) status code with the correct body', () => {
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);
    });
  });
  describe('Alternative case : the list is populated', () => {
    let response!: any;

    beforeAll(async () => {
      const model = app.get(ScopesService).model
      await model.create({ slug: 'test::slug', description: 'Test description' })
      
      response = await request(app.getHttpServer())
        .get('/scopes')
        .set('Accept', 'application/json');
    })
    it('Returns a 200 (OK) status code with the correct body', () => {
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([ { slug: 'test::slug', description: 'Test description' } ]);
    })
  })
});
