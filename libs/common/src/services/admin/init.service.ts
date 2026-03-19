import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from '@synple/common/entities';
import { SALT_ROUNDS } from '@synple/utils';
import { hash } from 'bcrypt';

export type InitPayload = {
  username: string;
  email: string;
  password: string;
};

@Injectable()
export class InitService {
  constructor(
    private config: ConfigService,
    @InjectModel(Account) private accounts: typeof Account,
  ) {}

  public async run(): Promise<void> {
    try {
      if (!this.shouldRun()) return;
      const { email, username, password } = this.getConfig();
      await this.accounts.create({
        email,
        username,
        passwordDigest: await hash(password, SALT_ROUNDS),
      });
    } catch {
      console.log('There was an exception running the initialization service');
    }
  }

  public async shouldRun(): Promise<boolean> {
    const { email } = this.getConfig();
    return (await this.accounts.findOne({ where: { email } })) === null;
  }

  private getConfig(): InitPayload {
    return {
      email: this.config.getOrThrow<string>('INIT_EMAIL'),
      username: this.config.getOrThrow<string>('INIT_USERNAME'),
      password: this.config.getOrThrow<string>('INIT_PASSWORD'),
    };
  }
}
