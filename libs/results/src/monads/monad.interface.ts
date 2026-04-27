export type BindFunction<T, Err> = (data: T) => Monad<T, Err>

/**
 * A monad is a simple container for a state T, that could result in an error of type Err through
 * the different methods calls and chainings. It can be unwrapped to access the inner data after
 * all chainings have been resolved (in success or error).
 */
export abstract class Monad<T, Err> {
  /**
   * The bind function calls the given callback with the inner value of the monad, and expects
   * another monad to be returned (with success or error) at the end of the execution.
   * 
   * @param {BindFunction} fct a function taking only one argument being the data inside the
   *   monad, and returning only a monad (error or success).
   * 
   * @return {Monad} the result of the execution of the function.
   */
  public abstract bind(fct: BindFunction<T, Err>): Monad<T, Err>

  /**
   * Gets the value inside the monad so that it can be part of further computations.
   * This method CAN throw exception and SHOULD throw exception whenever the inner state is
   * considered to be "in error" (whatever this error state means) and a value cannot be fetched.
   * 
   * @return {T} the inner value of the monad when it's possible to get it
   */
  public abstract unwrap(): T
  /**
   * 
   * @param defaultValue The default value to get if the inner value cannot be computed.
   */
  public abstract safeUnwrap(defaultValue: T): T | Err
  public abstract get data(): T|Err
  public abstract get ok(): boolean
}