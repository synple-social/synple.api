export class ImpossibleUnwrapException extends Error {
  public constructor() {
    super("unwrap.impossible")
  }
}