import { ExecutionContext } from "@nestjs/common";
import { AuthenticationGuard } from "@synple/common";

export class AuthenticationMock extends AuthenticationGuard {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    return true
  }
}