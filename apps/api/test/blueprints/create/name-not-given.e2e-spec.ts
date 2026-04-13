import { INestApplication } from "@nestjs/common"
import { createApplication } from "../../helpers/create-application.helper"
import request from "supertest"
import { BlueprintsModule } from "apps/api/src/blueprints/blueprints.module"

describe('POST /:uuid/blueprints', () => {
  let app!: INestApplication

  beforeAll(async () => {
    app = await createApplication({ module: BlueprintsModule })
  })
  describe('The name of the blueprint is not given', () => {
    let response!: any

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/uuid/blueprints')
        .set('Accept', 'application/json')
        .send({ slots: 10 })
    })

    it('Returns a 400 (Bad Request) status code', () => {
      expect(response.status).toEqual(400)
    })
    it('Returns the correct body', () => {
      expect(response.body).toEqual({ path: 'name', error: 'required' })
    })
    it('Has created no blueprint', async () => {
      const repository = app.get('BlueprintRepository')
      expect(await repository.count({})).toBe(0)
    })
  })
})