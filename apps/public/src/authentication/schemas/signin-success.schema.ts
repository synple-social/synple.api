import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const signinSuccessSchema: SchemaObject = {
  properties: {
    token: { type: 'string' },
  },
};
