import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Token } from '../entities/token.entity';
import { AccountsService, TokensService } from '../services';
import { Role } from '../entities';
import { Reflector } from '@nestjs/core';
import { RequiresScope } from '../decorators/requires-scope.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private tokensService: TokensService,
    private accountsService: AccountsService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const rawJwt = this.getToken(request);
    
    if (!rawJwt)
      throw new BadRequestException({ path: 'token', error: 'required' });

    const jwt = this.jwtService.decode(rawJwt);

    if (!jwt)
      throw new ForbiddenException({ path: 'token', error: 'forbidden' });

    const token = await this.tokensService.find(jwt.jti);

    if (!token)
      throw new ForbiddenException({ path: 'token', error: 'forbidden' });

    if (!await this.checkPermissions(token, context))
      throw new ForbiddenException({ path: 'token', error: 'forbidden' });

    request['jwtToken'] = jwt;
    request['currentUser'] = await this.accountsService.find(jwt.sub);

    return true;
  }

  protected async checkPermissions(token: Token, ctx: ExecutionContext): Promise<boolean> {
    const scope = this.reflector.get(RequiresScope, ctx.getHandler())

    if (!scope) return true

    const role: Role = await token.account.getRole()
    const scopes = await role.getScopes()
    const slugs = scopes.map(s => s.dataValues.slug)
    
    return slugs.includes(scope)
  }

  private getToken(request: Request): string | undefined {
    const [type, token] =
      (request.headers.authorization as string)?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
