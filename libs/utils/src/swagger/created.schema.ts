import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const CreatedSchema: SchemaObject = {
  properties: {
    id: { type: 'string' },
  },
};
