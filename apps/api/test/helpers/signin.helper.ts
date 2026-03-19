import { INestApplication } from "@nestjs/common"
import { Account, TokensService } from "@synple/common"
import { SALT_ROUNDS } from "@synple/utils"
import { hash } from 'bcrypt'

export type SigninHelperProps = {
  email: string,
  password: string,
  username: string,
  scopes: string[]
}

export type SigninHelperResult = {
  account: Account
  token: string
}

export async function signin(app: INestApplication, { email, username, password, scopes }: SigninHelperProps): Promise<SigninHelperResult> {
  const accounts = app.get('AccountRepository')
  const tokensService = app.get(TokensService)

  const account = await accounts.create({ email, username, uuid: '1', passwordDigest: await hash(password, SALT_ROUNDS) })
  return { account, token: await tokensService.create(email, password) }
}