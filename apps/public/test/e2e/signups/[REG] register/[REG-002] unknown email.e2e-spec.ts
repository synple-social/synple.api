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

  describe('[REG-002] a registration is created with an unknown email', () => {
    let response: any;
    let repositories: {
      preRegistrations?: typeof PreRegistration;
      registrations?: typeof Registration;
    } = {};
    beforeAll(async () => {
      await createPreregistration(email, app);
      repositories.preRegistrations = app.get(PreRegistrationsService).model;
      repositories.registrations = app.get(RegistrationsService).model;

      response = createRegistration('another@email.com', 'ABC123', app);
    });

    it('Returns a 404 (Not Found) status code with the correct body', () => {
      return response
        .expect(404)
        .expect('Content-Type', /application\/json/)
        .expect({ path: 'email', error: 'unknown' });
    });
    it('Has created no registration in the database', async () => {
      await response;
      expect(
        await repositories.registrations?.count({ where: { email } }),
      ).toBe(0);
    });
  });
});
