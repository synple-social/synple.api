import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const successSchema: SchemaObject = {
  properties: {
    slug: { type: 'string' },
    description: { type: 'string' },
  },
};
