import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { createPreregistration, createRegistration } from '../../http';
import { PreRegistration, PreRegistrationsService, Registration, RegistrationsService } from '@synple/common';
import { createApplication } from '../../helpers/create-test-module.helper';

describe('Pre-registrations scenarios', () => {

  const email = "email_001@test.com"

  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createApplication()
  });

  describe('[SC-001] a pre registration is created successfully', () => {
    let response: any;
    let models: {
      preRegistration?: typeof PreRegistration,
      registration?: typeof Registration
    } = {}
    beforeAll(async () => {
      await createPreregistration(email, app)
      models.preRegistration = app.get(PreRegistrationsService).model
      models.registration = app.get(RegistrationsService).model
      const preRegistration = await models.preRegistration.findOne({ where: { email } })
      response = createRegistration(email, `${preRegistration?.dataValues.confirmationCode}`, app)
    })

    it('Returns a 201 (Created) status code with the correct body', async () => {
      const firstRegistration = async () => (await models.registration?.findOne() as Registration)
      const { res } = await (response
        .expect(201)
        .expect('Content-Type', /application\/json/))
      expect(JSON.parse(res.text).id).toEqual((await firstRegistration()).id)
    })
  })
})
