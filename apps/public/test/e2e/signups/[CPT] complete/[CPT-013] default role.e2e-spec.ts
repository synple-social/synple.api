import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { Account, AccountsService, Role } from '@synple/common';
import { createApplication } from '../../../helpers/create-application.helper.ts';
import { rolesFactory } from 'apps/public/test/factories/roles.factory';
import { RegistrationsFactory } from 'apps/public/test/factories/signups/registrations.factory';
import request from 'supertest';
import { v4 as uuid } from "uuid"
import { isUUID } from 'class-validator';

describe('Accounts scenarios', () => {
  const email = 'email_001@test.com';

  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createApplication();
  });

  describe('[CPT-013] there is a default group in the database', () => {
    let response: any;
    let role!: Role;

    beforeAll(async () => {
      role = await rolesFactory(app, {
        name: 'TestScope',
        isDefault: true,
        uuid: uuid(),
      });

      const registration = await RegistrationsFactory(app, {
        email,
        uuid: '1',
      });

      response = await request(app.getHttpServer())
        .post('/signups/complete')
        .set('Accept', 'application/json')
        .send({
          email,
          registrationId: registration?.getDataValue('uuid'),
          password: 'password',
          passwordConfirmation: 'password',
          username: 'testUser',
        });
    });

    it('Returns a 201 (Created) status code with the correct body', () => {
      expect(response.status).toEqual(201)
      expect(response.body).toMatchObject({ email, username: 'testUser' });
      expect(isUUID(response.body.uuid)).toEqual(true)
    });
    it('Has been assigned the default role', async () => {
      const model = app.get(AccountsService).model;
      const account = (await model.findOne({ where: { email } })) as Account;
      expect(account.roleId).toEqual(role.id);
    });
  });
});
