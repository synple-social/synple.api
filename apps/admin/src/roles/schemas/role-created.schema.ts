import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const roleCreatedSchema: SchemaObject = {
  properties: {
    name: { type: 'string', example: 'Name of the created role' },
    isDefault: { type: 'boolean', example: false },
  },
};
