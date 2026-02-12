import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export const SuccessSchema: SchemaObject = {
  properties: {
    id: { type: "string" }
  }
}