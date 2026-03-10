import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function createErrorSchema(path: string, error: string): SchemaObject {
  return {
    properties: {
      path: {
        type: 'string',
        example: path,
        description:
          'The path in the input body or parameters that triggered the error',
      },
      error: {
        type: 'string',
        example: error,
        description:
          'A short string in kebab-case describing the error that occurred',
      },
    },
  };
}
