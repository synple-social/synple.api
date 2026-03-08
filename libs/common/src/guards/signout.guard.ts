import { Token } from "../entities/token.entity";
import { AuthenticationGuard } from "./authentication.guard";

export class SignoutGuard extends AuthenticationGuard {
  protected async checkValidity(token: Token): Promise<boolean> {
    return true;
  }
}