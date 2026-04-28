import { preRegistration, PreRegistration } from "@synple/core/registrations/pre-registration"
import { validatePreRegistration } from "@synple/core/registrations/pre-registration.validator"

describe("Pre-registration validation", () => {

  describe("Validating a valid model", () => {
    it("Validates the email if it is given with a correct value", () => {
      const result = preRegistration("test@email.com", "123ABC").bind(validatePreRegistration)
      expect(result.unwrap().email).toEqual("test@email.com")
    })
  })

  describe("Shows errors on email invalid values", () => {
    it("Does not validate the email if it has an incorrect format", () => {
      const result = preRegistration("invalid", "123ABC").bind(validatePreRegistration)
      expect(result.ok).toEqual(false)
    })
    it("Does not validate the email if no value is given", () => {
      const result = preRegistration("", "123ABC").bind(validatePreRegistration)
      expect(result.ok).toEqual(false)
    })
  })

  describe("Shows errors on confirmation code invalid values", () => {
    it("Does not validate the confirmation code if it has an incorrect format", () => {
      const result = preRegistration("test@email.com", "1234567890").bind(validatePreRegistration)
      expect(result.ok).toEqual(false)
    })
    it("Does not validate the confirmation code if no value is given", () => {
      const result = preRegistration("test@email.com", "").bind(validatePreRegistration)
      expect(result.ok).toEqual(false)
    })
  })
})