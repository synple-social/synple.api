import { Reflector } from "@nestjs/core";

export const RequiresScope = Reflector.createDecorator<string>();