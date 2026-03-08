import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Token } from "../entities/token.entity";
import { AccountsService, TokensService } from "../services";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private jwtService: JwtService, private tokensService: TokensService, private accountsService: AccountsService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const rawJwt = this.getToken(request)
    if (!rawJwt) throw new BadRequestException({ path: 'token', error: 'required' })
    const jwt = this.jwtService.decode(rawJwt)
    if (!jwt) throw new ForbiddenException({ path: 'token', error: 'forbidden' })
    const token = await this.tokensService.find(jwt.jti)

    if (!token) throw new ForbiddenException(({ path: 'token', error: 'forbidden' }))
    if (await this.checkValidity(token)) {
      request['jwtToken'] = jwt
      request['currentUser'] = await this.accountsService.find(jwt.sub)
    }

    return true
  }


  protected async checkValidity(token: Token): Promise<boolean> {
    return true;
  }

  private getToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}