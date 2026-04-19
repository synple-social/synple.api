import { Injectable } from '@nestjs/common';
import { SignupsCompleteDto } from 'apps/public/src/signups/dto/signups-complete.dto';
import { BadParameterException } from '@synple/utils/exceptions/bad-parameter.exception';
import {
  DocumentNotFoundException,
  SALT_ROUNDS,
  UsernameAlreadyExistingException,
} from '@synple/utils';
import { hash } from 'bcrypt';
import { Account } from '../entities/account.entity';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuid } from 'uuid';
import { Registration, Role } from '../entities';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account) public readonly model: typeof Account,
    @InjectModel(Role) public readonly roles: typeof Role,
    @InjectModel(Registration)
    public readonly registrations: typeof Registration,
  ) {}

  async create({
    email,
    registrationId,
    username,
    password,
  }: SignupsCompleteDto) {
    const registration = await this.findRegistrationOrFail({
      email,
      uuid: registrationId,
    });
    if ((await this.model.findAll({ where: { email } })).length)
      throw new UsernameAlreadyExistingException();
    const passwordDigest = await hash(password, SALT_ROUNDS);
    const role = await this.getDefaultRole();
    return await this.model.create({
      username,
      email,
      passwordDigest,
      registrationId: registration.id,
      uuid: uuid(),
      jwtSecret: uuid(),
      ...(role ? { roleId: role.id } : {}),
    });
  }

  public async findRegistrationOrFail({
    email,
    uuid,
  }: Partial<Registration>): Promise<Registration> {
    const found = await this.registrations.findOne({ where: { email, uuid } });
    if (found === null) throw new DocumentNotFoundException('email');
    return found;
  }

  public async find(uuid: string): Promise<Account> {
    return (await this.model.findOne({ where: { uuid } })) as Account;
  }

  private async getDefaultRole(): Promise<Role | null> {
    return (await this.roles.findOne({ where: { isDefault: true } })) as Role;
  }
}
