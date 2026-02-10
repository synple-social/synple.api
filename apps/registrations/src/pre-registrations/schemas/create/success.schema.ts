import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export const SuccessSchema: SchemaObject = {
  properties: {
    created: { type: 'boolean' }
  }
}