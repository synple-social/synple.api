import { INestApplication } from "@nestjs/common"
import { createApplication } from "../../helpers/create-application.helper"
import request from "supertest"
import { BlueprintsModule } from "apps/api/src/blueprints/blueprints.module"

describe('POST /:uuid/blueprints', () => {
  let app!: INestApplication

  beforeAll(async () => {
    app = await createApplication({ module: BlueprintsModule })
  })
  describe('The number of slots is too low and below 2', () => {
    let response!: any

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/uuid/blueprints')
        .set('Accept', 'application/json')
        .send({ name: 'exampleName', slots: 1 })
    })

    it('Returns a 400 (Bad Request) status code', () => {
      expect(response.status).toEqual(400)
    })
    it('Returns the correct body', () => {
      expect(response.body).toEqual({ path: 'slots', error: 'minimum' })
    })
  })
})