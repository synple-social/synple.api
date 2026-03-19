import { INestApplication } from '@nestjs/common';
import { createApplication } from '../helpers/create-application.helper';
import request from 'supertest';

describe('POST /:uuid/scopes', () => {
  let app!: INestApplication;

  beforeAll(async () => {
    app = await createApplication();
    await app
      .get('RoleRepository')
      .create({ name: 'test role', uuid: '1', isDefault: false });
    await app.get('ScopeRepository').create({ slug: 'test::scope', uuid: '1' });
  });

  describe('Nominal case', () => {
    let response!: any;

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/roles/1/scopes')
        .set('Accept', 'application/json')
        .send({ scopeId: '1' });
    });
    afterAll(async () => {
      await app.get('RoleScopeRepository').destroy({ where: {} });
    });
    it('Returns a 201 (Created) status code and the correct body', async () => {
      expect(response.status).toEqual(201);
      expect(response.body).toEqual({ created: true });
    });
    it('Has created a link between the scope and the role', async () => {
      expect(await app.get('RoleScopeRepository').count()).toEqual(1);
    });
  });
  describe('Exception case : the role is not found', () => {
    let response!: any;

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/roles/unknown/scopes')
        .set('Accept', 'application/json')
        .send({ scopeId: '1' });
    });
    it('Returns a 404 (Not Found) status code and the correct body', async () => {
      expect(response.status).toEqual(404);
      expect(response.body).toEqual({ path: 'uuid', error: 'unknown' });
    });
    it('Has created no link between the role and the scope', async () => {
      expect(await app.get('RoleScopeRepository').count()).toEqual(0);
    });
  });
  describe('Exception case : the scope is not found', () => {
    let response!: any;

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/roles/1/scopes')
        .set('Accept', 'application/json')
        .send({ scopeId: 'unknown' });
    });
    it('Returns a 404 (Not Found) status code and the correct body', async () => {
      expect(response.status).toEqual(404);
      expect(response.body).toEqual({ path: 'scopeId', error: 'unknown' });
    });
    it('Has created no link between the role and the scope', async () => {
      expect(await app.get('RoleScopeRepository').count()).toEqual(0);
    });
  });
});
