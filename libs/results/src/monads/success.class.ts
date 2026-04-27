import { BindFunction, Monad } from "./monad.interface"

export class Success<T, Err> extends Monad<T, Err> {
  public readonly ok: true = true

  public constructor(public readonly data: T) {
    super()
  }

  public bind(fct: BindFunction<T, Err>): Monad<T, Err> {
    return fct(this.data)
  }

  public unwrap(): T {
    return this.data
  }

  public safeUnwrap(): T | Err {
    return this.unwrap()
  }
}