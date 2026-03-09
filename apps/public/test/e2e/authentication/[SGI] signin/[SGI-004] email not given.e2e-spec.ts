import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";
import { createApplication } from "../../../helpers/create-application.helper.ts";
import request from "supertest"

describe("Sign-in scenarios", () => {
  const email = "email_001@test.com";

  let app: INestApplication<App>;
  let response: any

  beforeAll(async () => {
    app = await createApplication()
  });

  describe("[SGI-004] the user did not provide the required email address", () => {
    beforeAll(async () => {
      response = request(app.getHttpServer())
        .post("/auth/signin")
        .set("Accept", "application/json")
        .send({ password: "anypassword" })
    });

    it("Returns a 400 (Bad Request) status code with the correct body", () => {
      return response
        .expect(400)
        .expect("Content-Type", /application\/json/)
        .expect({ path: "email", error: "required" });
    });
  });
});
