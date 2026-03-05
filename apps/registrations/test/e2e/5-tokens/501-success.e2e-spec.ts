import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";
import { createApplication } from "../../helpers/create-application.helper.ts";
import request from "supertest"
import { AccountsService } from "@synple/common";
import { hash } from "bcrypt"
import { UuidsService } from "@synple/common";
import { UuidsMock } from "../../mocks/uuids.mock";
import { JwtService } from "@nestjs/jwt";

describe("Accounts scenarios", () => {
  const email = "email_001@test.com";

  let app: INestApplication<App>;
  let response: any

  beforeAll(async () => {
    app = await createApplication({
      overrides: [{ from: UuidsService, to: UuidsMock }]
    })
  });

  describe("[SC-201] the account is created successfully", () => {
    beforeAll(async () => {
      const accounts = app.get(AccountsService).model
      await accounts.create({ email, passwordDigest: await hash("password", 1), username: 'SuperNiceUsername', uuid: '1' })
      response = request(app.getHttpServer())
        .post("/tokens")
        .set("Accept", "application/json")
        .send({ email, password: "password" })
    });

    it("Returns a 201 (Created) status code with the correct body", () => {
      return response
        .expect(201)
        .expect("Content-Type", /application\/json/)
        .then(async response => {
          const jwtService = app.get(JwtService)
          const jwt = jwtService.decode((await response).body.token)
          expect(jwt).toMatchObject({
            username: 'SuperNiceUsername',
            sub: '1'
          })
        })
    });
  });
});
