import { Test, TestingModule } from "@nestjs/testing";
import { PreRegistrationsController } from "../../../src/pre-registrations/pre-registrations.controller";
import { describe, beforeAll, it } from "vitest";
import { preRegistrationModuleDefinition } from "../../../src/pre-registrations/pre-registrations.module";


describe('PreRegistrationsController', () => {
  let controller: PreRegistrationsController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule(preRegistrationModuleDefinition)
      .compile()

    controller = app.get<PreRegistrationsController>(PreRegistrationsController)
  })

  describe("create", () => {
    it("Returns the correct result", async () => {
      const result = await controller.create({ email: 'test@mail.com' })
      expect(result).toEqual({ created: true })
    })
  })
})