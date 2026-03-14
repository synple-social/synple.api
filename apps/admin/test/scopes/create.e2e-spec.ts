import { INestApplication } from '@nestjs/common';
import { createApplication } from '../helpers/create-application.helper';
import request from 'supertest';
import { Scope } from '@synple/common';
import { ScopesService } from '@synple/common/services/admin/scopes.service';

describe('POST /scopes', () => {
  let app!: INestApplication;
  let model!: typeof Scope;
  let response!: any;

  beforeAll(async () => {
    app = await createApplication();
    model = app.get(ScopesService).model
  });

  describe('Nominal case', () => {

    const slug = 'tests::first'

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/scopes')
        .set('Accept', 'application/json')
        .send({ slug, description: 'Test scope' })
    });

    it('Returns a 201 (Created) status code with the correct body', () => {
      expect(response.status).toEqual(201);
      expect(response.body).toEqual({ slug, description: 'Test scope' });
    });
    it('Has created a new scope in the database', async () => {
      expect(await model.count({ where: { slug } })).toEqual(1)
    })
    describe('The created scope', () => {
      let scope!: Scope

      beforeAll(async () => {
        scope = await model.findOne({ where: { slug } }) as Scope
      })
      it('Has the correct slug', () => {
        expect(scope.slug).toEqual(slug)
      })
      it('Has the correct description', () => {
        expect(scope.description).toEqual('Test scope')
      })
    })
  });
  describe('Alternative case : description not given', () => {
    const slug = 'tests::second'

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/scopes')
        .set('Accept', 'application/json')
        .send({ slug })
    });

    it('Returns a 201 (Created) status code with the correct body', () => {
      expect(response.status).toEqual(201);
      expect(response.body).toEqual({ slug, description: "" });
    });
    it('Has created a new scope in the database', async () => {
      expect(await model.count({ where: { slug } })).toEqual(1)
    })
    describe('The created scope', () => {
      let scope!: Scope

      beforeAll(async () => {
        scope = await model.findOne({ where: { slug } }) as Scope
      })
      it('Has the correct slug', () => {
        expect(scope.slug).toEqual(slug)
      })
      it('Has the correct description', () => {
        expect(scope.description).toEqual('')
      })
    })
  })
  describe('Exception case : slug not given', () => {
    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/scopes')
        .set('Accept', 'application/json')
        .send({})
    });
    it('Returns a 400 (Bad Request) status code with the correct body', () => {
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ path: 'slug', error: 'required' });
    })
  })
  describe('Exception case : invalid format for the slug', () => {
    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/scopes')
        .set('Accept', 'application/json')
        .send({ slug : 'INVALID_FORMAT' })
    });
    it('Returns a 400 (Bad Request) status code with the correct body', () => {
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ path: 'slug', error: 'format' });
    })
  })
});
