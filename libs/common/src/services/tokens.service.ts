import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { InvalidCredentialsException } from '@synple/utils/exceptions/invalid-credentials.exception';
import { Account } from '../entities';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../entities/token.entity';
import Sequelize from '@sequelize/core';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Account) public readonly accounts: typeof Account,
    @InjectModel(Token) public readonly model: typeof Token,
    @InjectConnection() private connection: Sequelize,
    private jwtService: JwtService,
  ) {}

  public async create(email: string, password: string) {
    const account = await this.accounts.findOne({ where: { email } });
    if (
      account === null ||
      !(await compare(password, account.dataValues.passwordDigest))
    ) {
      throw new InvalidCredentialsException();
    }
    return await this.connection.transaction<string>(async () => {
      const instance = await this.model.create({
        accountId: account.id,
        uuid: uuid(),
      });
      return this.createJwtFor(account, instance.dataValues.uuid);
    });
  }

  public async find(uuid: string): Promise<Token | null> {
    return this.model.findOne({ where: { uuid }, include: [Account] });
  }

  public async invalidate(uuid: string) {
    await this.model.update({ invalidatedAt: new Date() }, { where: { uuid } });
  }

  public createJwtFor(account: Account, jti: string = uuid()) {
    return this.jwtService.sign({
      sub: account.dataValues.uuid,
      username: account.dataValues.username,
      jti,
    });
  }
}
