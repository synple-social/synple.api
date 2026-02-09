import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export const ErrorSchema: SchemaObject = {
  properties: {
    path: {
      type: 'string',
      example: 'email',
      description: 'The path in the input body or parameters that triggered the error'
    },
    error: {
      type: 'string',
      example: 'regexp',
      description: 'A short string in kebab-case describing the error that occurred'
    }
  }
}