import { ImpossibleUnwrapException } from "../exceptions/impossible-unwrap.exception"
import { BindFunction, Monad } from "./monad.interface"

export class Failure<T, Err> extends Monad<T, Err> {
  public readonly ok: false = false

  public constructor(public readonly error: Err) {
    super()
  }

  public bind(_fct: BindFunction<T, Err>): Monad<T, Err> {
    return new Failure(this.error)
  }

  public unwrap(): T {
    throw new ImpossibleUnwrapException()
  }

  public safeUnwrap(): T | Err {
    return this.data
  }

  public get data(): Err {
    return this.error
  }
}