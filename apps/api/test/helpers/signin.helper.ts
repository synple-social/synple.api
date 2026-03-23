import { INestApplication } from '@nestjs/common';
import { Account, TokensService, UuidsService } from '@synple/common';
import { SALT_ROUNDS } from '@synple/utils';
import { hash } from 'bcrypt';
import { roleFactory } from '../factories/role.factory';
import { accountFactory } from '../factories/account.factory';
import { scopeFactory } from '../factories/scope.factory';

export type SigninHelperProps = {
  email: string;
  password: string;
  username: string;
  scopes?: string[];
};

export type SigninHelperResult = {
  account: Account;
  token: string;
};

export async function signin(
  app: INestApplication,
  { scopes = [] }: SigninHelperProps,
): Promise<SigninHelperResult> {
  const tokensService = app.get(TokensService);

  const role = await roleFactory.create(app)

  scopes.forEach(async slug => {
    const scope = await scopeFactory.create(app)
    await app.get("RoleScopeRepository").create({
      scopeId: scope.dataValues.id, roleId: role.dataValues.id
    })
  })

  const account = await accountFactory.create(app)
  return { account, token: await tokensService.create("test@synple.app", "password") };
}
