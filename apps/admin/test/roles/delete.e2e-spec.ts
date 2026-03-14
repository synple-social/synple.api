import { INestApplication } from "@nestjs/common"
import { createApplication } from "../helpers/create-application.helper"
import { Account, Role } from "@synple/common"
import request from "supertest"
import { RolesService } from "@synple/common/services/admin/roles.service"

describe('DELETE /roles/:id', () => {
  let app!: INestApplication
  let model!: typeof Role

  beforeAll(async () => {
    app = await createApplication()
    model = app.get(RolesService).model
  })
  describe('Nominal case', () => {
    let response!: any
    let role!: Role
    beforeAll(async () => {
      role = await model.create({ name: 'First role', isDefault: false })
      response = await request(app.getHttpServer())
        .delete(`/roles/${role.dataValues.uuid}`)
        .set('Accept', 'application/json')
      await role.reload()
    })
    it('Returns a 204 (No Content) status code and the correct body', () => {
      expect(response.status).toEqual(204)
    })
    it('Has marked the role as deleted', async () => {
      expect(role.dataValues.deletedAt).not.toEqual(null)
    })
  })
  describe('Alternative case : the role has users in it', () => {
    let response!: any
    let role!: Role
    let account!: Account
    let defaultRole!: Role

    beforeAll(async () => {
      defaultRole = await model.create({ name: 'Test default role', isDefault: true, uuid: '1' })
      role = await Role.create({ name: 'Second role', isDefault: false, uuid: '2' })
      account = await Account.create({
        username: 'Test username',
        passwordDigest: 'tesst',
        email: 'test@email.com',
        uuid: '1',
        jwtSecret: 'secret',
        roleId: role.id
      })
      response = await request(app.getHttpServer())
        .delete(`/roles/${role.dataValues.uuid}`)
        .set('Accept', 'application/json')
      await role.reload()
      await account.reload()
    })
    it('Returns a 204 (No Content) status code and the correct body', () => {
      expect(response.status).toEqual(204)
    })
    it('Has marked the role as deleted', async () => {
      expect(role.dataValues.deletedAt).not.toEqual(null)
    })
    it('Has put the user on the default group', async () => {
      expect(account.roleId).toEqual(defaultRole.id)
    })
  })
  describe('Alternative case : the role is not found', () => {
    let response!: any
    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .delete("/roles/unknown")
        .set('Accept', 'application/json')
    })
    it('Returns a 204 (No Content) status code and the correct body', () => {
      expect(response.status).toEqual(204)
    })
  })
  describe('Exception case : the role is the default one', () => {
    let response!: any
    let role!: Role

    beforeAll(async () => {
      role = await model.create({ name: 'Test default role', isDefault: true, uuid: '1' })
      response = await request(app.getHttpServer())
        .delete(`/roles/${role.dataValues.uuid}`)
        .set('Accept', 'application/json')
    })
    it('Returns a 422 (Unprocessable entity) status code and the correct body', () => {
      expect(response.status).toEqual(422)
      expect(response.body).toEqual({ path: 'uuid', error: 'default' })
    })
  })
})