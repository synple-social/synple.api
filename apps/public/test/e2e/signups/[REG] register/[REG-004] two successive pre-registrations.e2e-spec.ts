import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { createPreregistration, createRegistration } from '../../../http';
import {
  PreRegistration,
  PreRegistrationsService,
  Registration,
  RegistrationsService,
} from '@synple/common';
import { createApplication } from '../../../helpers/create-application.helper.ts';

describe('Registrations scenarios', () => {
  const email = 'email_001@test.com';

  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createApplication();
  });

  describe('[REG-004] two successive pre registration are created before the creation of the registration', () => {
    let response: any;
    let models: {
      preRegistration?: typeof PreRegistration;
      registration?: typeof Registration;
    } = {};
    const codes: string[] = [];
    beforeAll(async () => {
      models.preRegistration = app.get(PreRegistrationsService).model;
      models.registration = app.get(RegistrationsService).model;

      await createPreregistration(email, app);
      await createRegistration(email, 'ABC123', app);
      await createPreregistration(email, app);
      response = createRegistration(email, 'ABC123', app);
    });

    it('Returns a 201 (Created) status code with the correct body', async () => {
      const { res } = await response
        .expect(201)
        .expect('Content-Type', /application\/json/);
      expect(JSON.parse(res.text).id).toEqual(
        (await models.registration?.findByPk(1))?.uuid,
      );
    });
    it('Has correctly created one invalidated pre-registration for this email address', async () => {
      expect(
        await models.preRegistration
          ?.scope('invalid')
          .count({ where: { email } }),
      ).toBe(1);
    });
    it('Has correctly created one valid pre-registration for this email address', async () => {
      expect(
        await models.preRegistration
          ?.scope('valid')
          .count({ where: { email } }),
      ).toBe(1);
    });
    it('Has created only one registration', async () => {
      expect(await models.registration?.count({ where: { email } })).toBe(1);
    });
  });
});
