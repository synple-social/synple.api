export type BindFunction<T, Err> = (data: T) => Monad<T, Err>

export abstract class Monad<T, Err> {
  public abstract bind(fct: BindFunction<T, Err>): Monad<T, Err>
  public abstract unwrap(): T
  public abstract get data(): T|Err
  public abstract get ok(): boolean
}