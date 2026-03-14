import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import {
  Account,
  AccountsService,
  Role,
} from '@synple/common';
import { createApplication } from '../../../helpers/create-application.helper.ts';
import { TEST_UUID, UuidsMock } from '../../../mocks/uuids.mock';
import { UuidsService } from '@synple/common/services/uuids.service';
import { rolesFactory } from 'apps/public/test/factories/roles.factory';
import { RegistrationsFactory } from 'apps/public/test/factories/signups/registrations.factory';
import request from "supertest"

describe('Accounts scenarios', () => {
  const email = 'email_001@test.com';

  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createApplication({
      overrides: [{ from: UuidsService, to: UuidsMock }],
    });
  });

  describe('[CPT-013] there is a default group in the database', () => {
    let response: any
    let role!: Role

    beforeAll(async () => {
      role = await rolesFactory(app, { name: 'TestScope', isDefault: true, uuid: '1' })

      const registration = await RegistrationsFactory(app, { email, uuid: '1' })

      response = request(app.getHttpServer())
        .post('/signups/complete')
        .set('Accept', 'application/json')
        .send({
          email,
          registrationId: registration?.getDataValue('uuid'),
          password: 'password',
          passwordConfirmation: 'password',
          username: 'testUser',
        })
    });

    it('Returns a 201 (Created) status code with the correct body', () => {
      return response
        .expect(201)
        .expect('Content-Type', /application\/json/)
        .expect({ email, username: 'testUser', uuid: TEST_UUID })
    });
    it('Has been assigned the default role', async () => {
      const model = app.get(AccountsService).model
      const account = await model.findOne({ where: { email } }) as Account
      expect(account.roleId).toEqual(role.id)
    });
  });
});
