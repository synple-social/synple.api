import { INestApplication } from '@nestjs/common';
import { createApplication } from '../helpers/create-application.helper';
import request from 'supertest';
import { Role, Scope } from '@synple/common';

describe('DELETE /roles/:uuid/scopes/scopeId', () => {
  let app!: INestApplication;
  let role!: Role;
  let scope!: Scope;

  beforeAll(async () => {
    app = await createApplication();
    role = await app
      .get('RoleRepository')
      .create({ name: 'test role', uuid: '1', isDefault: false });
    scope = await app
      .get('ScopeRepository')
      .create({ slug: 'test::scope', uuid: '1' });
  });

  describe('Nominal case', () => {
    let response!: any;

    beforeAll(async () => {
      await app
        .get('RoleScopeRepository')
        .create({ roleId: role.id, scopeId: scope.id });
      response = await request(app.getHttpServer())
        .delete('/roles/1/scopes/1')
        .set('Accept', 'application/json')
        .send({ scopeId: '1' });
    });
    it('Returns a 204 (No Content) status code and the correct body', async () => {
      expect(response.status).toEqual(204);
    });
    it('Has deleted the link between the scope and the role', async () => {
      expect(await app.get('RoleScopeRepository').count()).toEqual(0);
    });
  });
  describe('Exception case : the role is not found', () => {
    let response!: any;

    beforeAll(async () => {
      await app
        .get('RoleScopeRepository')
        .create({ roleId: role.id, scopeId: scope.id });
      response = await request(app.getHttpServer())
        .delete('/roles/unknown/scopes/1')
        .set('Accept', 'application/json')
        .send({ scopeId: '1' });
    });
    afterAll(
      async () => await app.get('RoleScopeRepository').destroy({ where: {} }),
    );
    it('Returns a 404 (Not Found) status code and the correct body', async () => {
      expect(response.status).toEqual(404);
      expect(response.body).toEqual({ path: 'uuid', error: 'unknown' });
    });
    it('Has deleted no link between the role and the scope', async () => {
      expect(await app.get('RoleScopeRepository').count()).toEqual(1);
    });
  });
  describe('Exception case : the scope is not found', () => {
    let response!: any;

    beforeAll(async () => {
      await app
        .get('RoleScopeRepository')
        .create({ roleId: role.id, scopeId: scope.id });
      response = await request(app.getHttpServer())
        .delete('/roles/1/scopes/unknown')
        .set('Accept', 'application/json')
        .send({ scopeId: '1' });
    });
    afterAll(
      async () => await app.get('RoleScopeRepository').destroy({ where: {} }),
    );
    it('Returns a 404 (Not Found) status code and the correct body', async () => {
      expect(response.status).toEqual(404);
      expect(response.body).toEqual({ path: 'scopeId', error: 'unknown' });
    });
    it('Has deleted no link between the role and the scope', async () => {
      expect(await app.get('RoleScopeRepository').count()).toEqual(1);
    });
  });
});
