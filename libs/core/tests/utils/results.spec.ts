import { Errors } from "@synple/core/utils/errors.enum"
import { success, Result, failure } from "@synple/core/utils/results"

describe("success", () => {
  it("Returns a success class with the data embedded in it", () => {
    expect(success("test").data).toEqual("test") 
  })
})

describe("Success<T>", () => {
  let monad!: Result<string, Errors>
  describe("bind returns success", () => {
    beforeEach(() => {
      monad = success("test").bind(s => success("other"))
    })
    it("Returns a success monad if the bound function returns success", () => {
      expect(monad.ok).toBe(true)
    })
    it("Returns the correct data", () => {
      expect(monad.data).toEqual("other")
    })
  })

  describe("bind returns failure", () => {
    beforeEach(() => {
      monad = success("test").bind(s => failure(Errors.EMAIL_FORMAT))
    })
    it("Returns a failure monad if the bound function returns failure", () => {
      expect(monad.ok).toBe(false)
    })
    it("Returns the correct data", () => {
      expect(monad.data).toEqual("EMAIL_FORMAT")
    })
  })

  describe("Chain bind failure, then success", () => {
    beforeEach(() => {
      monad = success<string>("test")
        .bind(_ => failure(Errors.EMAIL_FORMAT))
        .bind(_ => success("other"))
    })
    it("Returns a failure monad if the bound function returns failure", () => {
      expect(monad.ok).toBe(false)
    })
    it("Returns the correct data", () => {
      expect(monad.data).toEqual("EMAIL_FORMAT")
    })
  })
})