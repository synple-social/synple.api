import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";
import { createApplication } from "../../../helpers/create-application.helper.ts";
import request from "supertest"
import { AccountsService } from "@synple/common";
import { hash } from "bcrypt"

describe("Sign-in scenarios", () => {
  const email = "email_001@test.com";

  let app: INestApplication<App>;
  let response: any

  beforeAll(async () => {
    app = await createApplication()
  });

  describe("[SGI-003] the password provided with the email address is not the correct one", () => {
    beforeAll(async () => {
      const model = app.get(AccountsService).model
      await model.create({ email, passwordDigest: await hash("password", 1), username: 'CreateUsername' })
      response = request(app.getHttpServer())
        .post("/auth/signin")
        .set("Accept", "application/json")
        .send({ email, password: "wrongpassword" })
    });

    it("Returns a 201 (Created) status code with the correct body", () => {
      return response
        .expect(403)
        .expect("Content-Type", /application\/json/)
        .expect({ path: "credentials", error: "unknown" });
    });
  });
});
