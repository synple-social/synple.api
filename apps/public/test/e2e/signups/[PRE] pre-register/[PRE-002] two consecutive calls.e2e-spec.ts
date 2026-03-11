import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { createPreregistration } from '../../../http/create-pre-registration.http';
import { PreRegistration, PreRegistrationsService, UuidsService } from '@synple/common';
import { createApplication } from '../../../helpers/create-application.helper.ts';
import { TEST_UUID, UuidsMock } from 'apps/public/test/mocks/uuids.mock';

describe('Pre registrations scenarios', () => {
  let app: INestApplication<App>;
  const email = 'test_002@mail.com';

  beforeAll(async () => {
    app = await createApplication({
      overrides: [{ from: UuidsService, to: UuidsMock }],
    });
  });

  describe('[PRE-002] a soon-to-be user makes two consecutive pre registration creation attempts with the same email address', () => {
    let lastResponse: any;
    let model: typeof PreRegistration;

    beforeAll(async () => {
      await createPreregistration(email, app);
      lastResponse = createPreregistration(email, app);
      model = app.get(PreRegistrationsService).model;
    }, 20000);
    it('Returns a 201 (Created) status code', async () => {
      return lastResponse
        .expect(201)
        .expect('Content-Type', /json/)
        .expect({ id: TEST_UUID });
    });
    it('Has created only two pre registrations', async () => {
      expect((await model.findAll({ where: { email } })).length).toBe(2);
    });
    it('Has created one invalidated pre registration', async () => {
      expect(
        (await model.scope('invalid').findAll({ where: { email } })).length,
      ).toBe(1);
    });
    it('Has created one valid pre registration', async () => {
      expect(
        (await model.scope('valid').findAll({ where: { email } })).length,
      ).toBe(1);
    });
    it('Has created the invalidated pre registration before the valid one', async () => {
      const invalidated = await model
        .scope('invalid')
        .findOne({ where: { email } });
      const valid = await model.scope('valid').findOne({ where: { email } });
      expect(invalidated?.createdAt?.getTime() || 0).toBeLessThan(
        valid?.createdAt?.getTime() || Number.NEGATIVE_INFINITY,
      );
    });
  });
});
