import { INestApplication } from '@nestjs/common';
import { Account, TokensService, UuidsService } from '@synple/common';
import { SALT_ROUNDS } from '@synple/utils';
import { hash } from 'bcrypt';

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
  { email, username, password, scopes = [] }: SigninHelperProps,
): Promise<SigninHelperResult> {
  const tokensService = app.get(TokensService);

  const role = await app.get('RoleRepository').create({
    name: 'TestRole',
    uuid: '2'
  })

  scopes.forEach(async slug => {
    const scope = await app.get('ScopeRepository').create({
      slug, uuid: app.get(UuidsService).generate()
    })
    await app.get("RoleScopeRepository").create({
      scopeId: scope.dataValues.id, roleId: role.dataValues.id
    })
  })

  const account = await app.get('AccountRepository').create({
    email,
    username,
    uuid: '1',
    passwordDigest: await hash(password, SALT_ROUNDS),
  });
  return { account, token: await tokensService.create(email, password) };
}
