import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { createApplication } from '../../helpers/create-application.helper.ts';
import request from "supertest"
import { PasswordRequest } from '@synple/common/entities/password-request.entity';
import { Account, PasswordsService } from '@synple/common';
import { hash } from "bcrypt"

describe("Password reset scenarios", () => {

  const email = "email_001@test.com"

  let app: INestApplication<App>;
  let model!: typeof PasswordRequest;
  let account!: typeof Account;

  beforeAll(async () => {
    app = await createApplication()
    model = app.get(PasswordsService).model
    account = app.get(PasswordsService).accounts
  });

  describe('[SC-403] a user attempsq to modify a password with an unknwon confirmation code', () => {
    let response: any;

    beforeAll(async () => {
      await account.create({ email, passwordDigest: await hash("password", 1), uuid: "1", username: "testuser" })

      await request(app.getHttpServer())
        .post("/passwords/request")
        .set("Accept", "application/json")
        .send({ email })
      response = request(app.getHttpServer())
        .post('/passwords/reset')
        .set('Accept', 'application/json')
        .send({ email, confirmationCode: 'XYZ456', password: 'newPassword', passwordConfirmation: 'newPassword' })
    })

    it('Returns a 404 (Not Found) status code with the correct body', () => {
      return response
        .expect(404)
        .expect("Content-Type", /json/)
        .expect({ path: 'email', error: 'unknown' })
    })
  })
})
