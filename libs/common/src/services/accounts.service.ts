import { Injectable } from "@nestjs/common";
import { SignupsCompleteDto } from "apps/public/src/signups/dto/signups-complete.dto";
import { RegistrationsService } from "./registrations.service";
import { BadParameterException } from "@synple/utils/exceptions/bad-parameter.exception";
import { SALT_ROUNDS, UsernameAlreadyExistingException } from "@synple/utils";
import { hash } from 'bcrypt'
import { Account } from "../entities/account.entity";
import { InjectModel } from "@nestjs/sequelize";
import { UuidsService } from "./uuids.service";

@Injectable()
export class AccountsService {

  constructor(
    @InjectModel(Account) public readonly model: typeof Account,
    private readonly registrationService: RegistrationsService,
    private readonly uuid: UuidsService,
  ) { }

  async create({ email, registrationId, username, password, passwordConfirmation }: SignupsCompleteDto) {
    const registration = await this.registrationService.findOrFail({ email, uuid: registrationId })
    if (password !== passwordConfirmation) throw new BadParameterException('passwordConfirmation', 'not-matching')
    if ((await this.model.findAll({ where: { email } })).length) throw new UsernameAlreadyExistingException()
    const passwordDigest = await hash(password, SALT_ROUNDS)
    return await this.model.create({
      username,
      email,
      passwordDigest,
      registrationId: registration.id,
      uuid: this.uuid.generate(),
      jwtSecret: this.uuid.generate(),
    })
  }

  public async find(uuid: string): Promise<Account> {
    return await this.model.findOne({ where: { uuid } }) as Account
  }
}