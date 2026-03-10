export class BadParameterException extends Error {
  constructor(
    public readonly path: string,
    public readonly error: string,
  ) {
    super(`${path}.${error}`);
  }
}
