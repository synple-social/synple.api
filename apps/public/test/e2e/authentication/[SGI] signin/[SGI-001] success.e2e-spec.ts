import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";
import { createApplication } from "../../../helpers/create-application.helper.ts";
import request from "supertest"
import { Account, AccountsService, TokensService } from "@synple/common";
import { hash } from "bcrypt"
import { UuidsService } from "@synple/common";
import { TEST_UUID, UuidsMock } from "../../../mocks/uuids.mock";
import { JwtService } from "@nestjs/jwt";
import { Token } from "@synple/common/entities/token.entity";

describe("Sign-in scenarios", () => {
  const email = "email_001@test.com";

  let app: INestApplication<App>;
  let response: any
  let model: typeof Token

  beforeAll(async () => {
    app = await createApplication({
      overrides: [{ from: UuidsService, to: UuidsMock }]
    })
  });

  describe("[SGI-001] the user signs in successfully", () => {
    beforeAll(async () => {
      const accounts = app.get(AccountsService).model
      model = app.get(TokensService).model
      await accounts.create({ email, passwordDigest: await hash("password", 1), username: 'SuperNiceUsername', uuid: '1' })
      response = request(app.getHttpServer())
        .post("/auth/signin")
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

    it("Creates a token in the database to keep track of user signing out", async () => {
      expect(await model.scope('valid').count()).toEqual(1)
      expect(await model.scope('invalid').count()).toEqual(0)
    })

    describe('The created token', () => {
      let token: Token

      beforeAll(async () => {
        token = await model.findOne({ include: Account }) as Token
      })
      it("Is linked to the correct account", () => {
        expect(token.dataValues.account.dataValues.email).toEqual(email)
      })
      it("Has the correct uuid", () => {
        expect(token.dataValues.uuid).toEqual(TEST_UUID)
      })
    })
  });
});
