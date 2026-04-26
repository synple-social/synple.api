import { Failure } from "./failure.class";
import { Success } from "./success.class";

export type Result<T, Err> = Success<T, Err> | Failure<T, Err>

export function success<T, Err>(data: T): Success<T, Err> {
  return new Success<T, Err>(data)
}

export function failure<T, Err>(error: Err): Failure<T, Err> {
  return new Failure(error)
}