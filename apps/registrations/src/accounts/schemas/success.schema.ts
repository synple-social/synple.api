import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export const successSchema: SchemaObject = {
	properties: {
		uuid: {
			type: "string",
		},
		username: {
			type: "string",
		},
		email: {
			type: "string",
		},
	},
};
