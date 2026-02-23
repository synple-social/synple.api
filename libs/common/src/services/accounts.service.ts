import { Injectable } from "@nestjs/common";
import { CreateAccountDto } from "apps/registrations/src/accounts/dto/create-account.dto";
import { RegistrationsService } from "./registrations.service";
import { BadParameterException } from "@synple/utils/exceptions/bad-parameter.exception";
import { SALT_ROUNDS, UsernameAlreadyExistingException } from "@synple/utils";
import { hash } from 'bcrypt'
import { Account } from "../entities/account.entity";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class AccountsService {

  constructor(
    @InjectModel(Account) public readonly model: typeof Account,
    private readonly registrationService: RegistrationsService
  ) { }

  async create({ email, registrationId, username, password, passwordConfirmation }: CreateAccountDto) {
    await this.registrationService.findOrFail({ email, id: registrationId })
    if (password !== passwordConfirmation) throw new BadParameterException('passwordConfirmation', 'not-matching')
    if ((await this.model.findAll({ where: { email } })).length) throw new UsernameAlreadyExistingException()
    const passwordDigest = await hash(password, SALT_ROUNDS)
    return await this.model.create({ username, email, passwordDigest, registrationId })
  }
}