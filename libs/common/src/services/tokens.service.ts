import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { InvalidCredentialsException } from "@synple/utils/exceptions/invalid-credentials.exception";
import { Account } from "../entities";
import { compare } from "bcrypt"
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Account) public readonly accounts: typeof Account,
    private jwtService: JwtService,
  ) { }

  public async create(email: string, password: string) {
    const account = await this.accounts.findOne({ where: { email } })
    if (account === null || !(await compare(password, account.dataValues.passwordDigest))) {
      throw new InvalidCredentialsException()
    }
    return { token: await this.createJwtFor(account) }
  }

  protected async createJwtFor(account: Account) {
    return await this.jwtService.signAsync({
      sub: account.dataValues.uuid,
      username: account.dataValues.username,
    })
  }
}