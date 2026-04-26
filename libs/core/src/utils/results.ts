import { Errors } from "./errors.enum"

export type BindFunction<T, Err> = (data: T) => Result<T, Err>

export abstract class Monad<T, Err> {
  public abstract bind(fct: BindFunction<T, Err>): Result<T, Err>
  public abstract get data(): T|Err
}

export class Success<T, Err> extends Monad<T, Err> {
  public readonly ok: true = true

  public constructor(public readonly data: T) {
    super()
  }

  public bind(fct: BindFunction<T, Err>): Result<T, Err> {
    return fct(this.data)
  }
}

export class Failure<T, Err> extends Monad<T, Err> {
  public readonly ok: false = false

  public constructor(public readonly error: Err) {
    super()
  }

  public bind(_fct: BindFunction<T, Err>): Result<T, Err> {
    return new Failure(this.error)
  }

  public get data(): Err {
    return this.error
  }
}

export type Result<T, Err> = Success<T, Err> | Failure<T, Err>

export function success<T>(data: T): Success<T, Errors> {
  return new Success<T, Errors>(data)
}

export function failure<T>(error: Errors): Failure<T, Errors> {
  return new Failure(error)
}