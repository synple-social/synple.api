import { INestApplication } from '@nestjs/common';
import { createApplication } from '../../helpers/create-application.helper';
import request from 'supertest';
import { BlueprintsModule } from 'apps/api/src/blueprints/blueprints.module';
import { Blueprint } from '@synple/common/entities/blueprints/blueprint.entity';
import { isUUID } from 'class-validator';
import { fakeLogin } from '../../helpers/fake-login.helper';

describe('POST /:uuid/blueprints', () => {
  let app!: INestApplication;

  beforeAll(async () => {
    app = await createApplication({ module: BlueprintsModule });
  });
  describe('The blueprint is successfully created', () => {
    let response!: any;

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/uuid/blueprints')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${await fakeLogin()}`)
        .send({ name: 'test-blueprint', slots: 10 });
    });

    it('Returns a 201 (Created) status code', () => {
      expect(response.status).toEqual(201);
    });
    it('Returns the correct body', () => {
      expect(response.body).toMatchObject({
        name: 'test-blueprint',
        slots: 10,
      });
      expect(isUUID(response.body.id)).toEqual(true);
    });
    it('Has created a blueprint', async () => {
      const repository = app.get('BlueprintRepository');
      expect(await repository.count({})).toBe(1);
    });
    describe('The created blueprint', () => {
      let blueprint!: Blueprint;

      beforeAll(async () => [
        (blueprint = await app.get('BlueprintRepository').findOne()),
      ]);
      it('Has the correct name', () =>
        expect(blueprint.name).toEqual('test-blueprint'));
      it('Has the correct number of slots', () =>
        expect(blueprint.slots).toEqual(10));
      it('Has an UUID as id', () => expect(isUUID(blueprint.id)).toEqual(true));
    });
  });
});
