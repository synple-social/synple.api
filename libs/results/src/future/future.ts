type ResolveFct<T> = (data: T) => T
type RejectFct<E> = (err: E) => void

type Resolvable<T, E> = (resolve: ResolveFct<T>, reject: RejectFct<E>) => Promise<T>

/**
 * A future is a structure that can chain "future calls" and resolve them as lazily as possible.
 * T is the type that the value resolved will have if there are no errors.
 * E is the error type, usually error classes, enums or objects that will be given when the promise is rejected.
 */
export class Future<T, E> {

  public constructor(private resolvable: Resolvable<T, E>) {}

  /**
   * Creates a new future wrapping a promise generator in it. It allows the chaining of further methods easily.
   * It wraps the generator in a future by binding its resolve and reject functions.
   * 
   * @param generator The asynchronous function returning the promise that will be resolved at the end.
   */
  public static promise<U, E>(generator: () => Promise<U>): Future<U, E> {
    const resolvable: Resolvable<U, E> = async (resolve, reject) => generator().then(resolve)
    return new Future<U, E>(resolvable)
  }

  public static from<U, E>(generator: () => U): Future<U, E> {
    const resolvable: Resolvable<U, E> = async (resolve, reject) => {
      return resolve(generator())
    }
    return new Future<U, E>(resolvable)
  }

  public async await(resolve: ResolveFct<T>, reject: RejectFct<E> = () => {}): Promise<T> {
    return await this.resolvable(resolve, reject)
  }

  public chain<U>(generator: (data: T) => Promise<U>): Future<U, E> {

  }
}