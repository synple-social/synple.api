import { INestApplication } from "@nestjs/common"
import { createApplication } from "apps/public/test/helpers/create-application.helper.ts";
import request from "supertest"

describe('Signing out of the application', () => {

  let app: INestApplication;
  let response: any;

  beforeAll(async () => {
    app = await createApplication()
  })
  describe('[SGO-002] a user tries to log out with an invalid token', () => {
    beforeAll(async () => {
      response = request(app.getHttpServer())
        .post(`/auth/signout`)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer invalid_token')
        .end()
    })
    it('Returns a 400 (Bad Request) with a message expliciting the error', async () => {
      response
        .expect(403)
        .expect("Content-Type", /application\/json/)
        .expect({ path: 'token', error: 'forbidden' });
    })
  })
})