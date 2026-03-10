export class DocumentNotFoundException extends Error {
  constructor(public readonly path: string) {
    super(`${path}.unknown`);
  }
}
