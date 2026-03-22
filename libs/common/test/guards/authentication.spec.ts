import { INestApplication } from "@nestjs/common"
import { Account, TokensService } from "@synple/common"
import { SALT_ROUNDS } from "@synple/utils"
import { hash } from "bcrypt"
import request from "supertest"
import { createApplication } from "../helpers/create-application.helper"
import { DummyModule } from "../helpers/dummies/dummy.controller"

describe('AuthenticationGuard', () => {

  let app!: INestApplication
  let response!: any
  let account !: Account

  beforeAll(async () => {
    app = await createApplication({
      underTest: [ DummyModule ]
    })
    const scope = await app.get("ScopeRepository").create({
      slug: 'test::scope',
      uuid: '2',
    })
    const role = await app.get('RoleRepository').create({
      name: 'Test role',
      uuid: '3'
    })
    await app.get('RoleScopeRepository').create({
      scopeId: scope.dataValues.id,
      roleId: role.dataValues.id,
    })
    account = await app.get("AccountRepository").create({
      username: "TestUsername",
      passwordDigest: await hash("password", SALT_ROUNDS),
      email: "test@email.com",
      uuid: "1",
      roleId: role.dataValues.id
    })
  })

  describe('The user provides no JWT', () => {
    beforeAll(async () => {
      response = await request(app.getHttpServer()).get("/dummy")
    })
    it("Returns a 403 (Forbidden) status code and the correct body", () => {
      expect(response.body).toEqual({ path: "token", error: "required" })
      expect(response.status).toBe(400)
    })
  })
  describe("The provided JWT cannot be correctly parsed", () => {
    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .get("/dummy")
        .set("Authorization", "Bearer invalid-token")
    })
    it("Returns a 403 (Forbidden) status code and the correct body", () => {
      expect(response.body).toEqual({ path: "token", error: "forbidden" })
      expect(response.status).toBe(403)
    })
  })
  describe("The provided JWT does not correspond to a token in the database", () => {
    beforeAll(async () => {
      const token = app.get(TokensService).createJwtFor(account, "generic-jti")
      response = await request(app.getHttpServer())
        .get("/dummy")
        .set("Authorization", `Bearer ${token}`)
    })
    it("Returns a 403 (Forbidden) status code and the correct body", () => {
      expect(response.body).toEqual({ path: "token", error: "forbidden" })
      expect(response.status).toBe(403)
    })
  })
  describe('The user has no right to access the route', () => {
    beforeAll(async () => {
      const otherAccount = await app.get("AccountRepository").create({
        username: "OtherUsername",
        passwordDigest: await hash("password", SALT_ROUNDS),
        email: "othertest@email.com",
        uuid: "4",
      })
      const token = app.get(TokensService).createJwtFor(otherAccount, "generic-jti")
      response = await request(app.getHttpServer())
        .get("/dummy")
        .set("Authorization", `Bearer ${token}`)
    })
    it("Returns a 403 (Forbidden) status code and the correct body", () => {
      expect(response.body).toEqual({ path: "token", error: "forbidden" })
      expect(response.status).toBe(403)
    })
  })
  describe("The provided JWT is valid", () => {
    beforeAll(async () => {
      const token = await app.get(TokensService).create("test@email.com", "password")
      response = await request(app.getHttpServer())
        .get("/dummy")
        .set("Authorization", `Bearer ${token}`)
    })
    it("Returns a 200 (OK) status code and the correct body", () => {
      expect(response.body).toEqual({ success: true })
      expect(response.status).toBe(200)
    })
  })
})