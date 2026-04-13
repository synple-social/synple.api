import { INestApplication } from '@nestjs/common';
import { createApplication } from '../helpers/create-application.helper';
import request from 'supertest';
import { Role } from '@synple/common';
import { RolesService } from '@synple/common/services/admin/roles.service';
import { isUUID } from 'class-validator';

describe('POST /roles', () => {
  let app!: INestApplication;
  let model!: typeof Role;

  beforeAll(async () => {
    app = await createApplication();
    model = app.get(RolesService).model;
  });

  describe('Nominal case', () => {
    let response!: any;

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/roles')
        .set('Accept', 'application/json')
        .send({ name: 'Test role', isDefault: true });
    });
    it('Returns a 201 (Created) status code and the correct body', () => {
      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({
        name: 'Test role',
        isDefault: true,
      });
      expect(isUUID(response.body.uuid)).toEqual(true);
    });
    it('Has created a role in the database', async () => {
      expect(await model.count()).toEqual(1);
    });
    describe('The created role', () => {
      let role!: Role;

      beforeAll(async () => {
        role = (await model.findOne()) as Role;
      });
      it('Has the correct name', () => {
        expect(role.name).toEqual('Test role');
      });
      it('Is marked as the dfault role', () => {
        expect(role.isDefault).toEqual(true);
      });
    });
  });
  describe('Alternative case : creating two default roles', () => {
    beforeAll(async () => {
      await request(app.getHttpServer())
        .post('/roles')
        .set('Accept', 'application/json')
        .send({ name: 'First role', isDefault: true });
      await request(app.getHttpServer())
        .post('/roles')
        .set('Accept', 'application/json')
        .send({ name: 'Second role', isDefault: true });
    });
    it('Has made the first role not default', async () => {
      expect(
        await model.count({ where: { name: 'First role', isDefault: false } }),
      ).toEqual(1);
    });
    it('Has made the second role a default role', async () => {
      expect(
        await model.count({ where: { name: 'Second role', isDefault: true } }),
      ).toEqual(1);
    });
  });
  describe('Exception case : the name is not given', () => {
    let response!: any;

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/roles')
        .set('Accept', 'application/json')
        .send({});
    });
    it('Returns a 400 (Bad Request) status code and the correct body', () => {
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ path: 'name', error: 'required' });
    });
  });
});
