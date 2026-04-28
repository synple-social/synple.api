import { Future } from "@synple/results/future/future"

describe('Future', () => {
  describe('from', () => {
    it('Creates a future able to resolve to the non asynchrnous value given', async () => {
      const future = Future.from(() => 42)
      expect(await future.await(v => v)).toEqual(42)
    })
  })
  describe('promise', () => {
    it('Creates a future wrapping a promise and is able to return its inner value', async () => {
      const future = Future.promise(async () => 42)
      expect(await future.await(v => v)).toEqual(42)
    }, 2000)
  })
  describe('chain', () => {
    it('Can chain two calls to return a future with the correct inner value', async () => {
      const future = Future.from(() => 42).chain(async v => v.toString())
      expect(await future.await(v => v)).toEqual('42')
    })
  })
})