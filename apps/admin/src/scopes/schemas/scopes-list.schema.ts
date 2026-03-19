import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const scopesListSchema: SchemaObject = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      description: { type: 'string', example: 'Description of the scope' },
      slug: { type: 'string', example: 'test::scope' },
    },
  },
};
