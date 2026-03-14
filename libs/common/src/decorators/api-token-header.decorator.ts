import { ApiHeader } from "@nestjs/swagger";

export const ApiTokenHeader = ApiHeader({
  name: 'Authentication',
  description: 'The bearer token use to authenticate this request.',
  example: 'Bearer <TOKEN>',
  required: true
})