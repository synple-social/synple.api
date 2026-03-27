import { INestApplication } from "@nestjs/common"
import { createApplication } from "../../helpers/create-application.helper"
import request from "supertest"

describe('POST /:uuid/blueprints', () => {
  let app!: INestApplication

  beforeAll(async () => {
    app = await createApplication()
  })
  describe('The blueprint is successfully created', () => {
    let response!: any

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/uuid/blueprints')
        .set('Accept', 'application/json')
        .send({})
    })

    it('Returns a 201 (Created) status code', () => {
      expect(response.status).toEqual(201)
    })
    it('Returns the correct body', () => {
      expect(response.body).toEqual({ created: true })
    })
  })
})