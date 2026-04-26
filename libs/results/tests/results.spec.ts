import { Monad } from "@synple/results/monads/monad.interface"
import { failure, success } from "@synple/results/monads/result.type"

enum Errors { TEST = "TEST" }

describe("success", () => {
  it("Returns a success class with the data embedded in it", () => {
    expect(success("test").data).toEqual("test") 
  })
})

describe("Success<T>", () => {
  let monad!: Monad<string, Errors>
  describe("bind returns success", () => {
    beforeEach(() => {
      monad = success<string, Errors>("test").bind(s => success("other"))
    })
    it("Returns a failure monad if the bound function returns failure", () => {
      expect(monad.ok).toBe(true)
    })
    it("Returns the correct data", () => {
      expect(monad.data).toEqual("other")
    })
  })

  describe("bind returns failure", () => {
    beforeEach(() => {
      monad = success<string, Errors>("test").bind(s => failure(Errors.TEST))
    })
    it("Returns a failure monad if the bound function returns failure", () => {
      expect(monad.ok).toBe(false)
    })
    it("Returns the correct data", () => {
      expect(monad.data).toEqual(Errors.TEST)
    })
  })

  describe("Chain bind failure, then success", () => {
    beforeEach(() => {
      monad = success<string, Errors>("test")
        .bind(_ => failure(Errors.TEST))
        .bind(_ => success("other"))
    })
    it("Returns a failure monad if the bound function returns failure", () => {
      expect(monad.ok).toBe(false)
    })
    it("Returns the correct data", () => {
      expect(monad.data).toEqual(Errors.TEST)
    })
  })
})