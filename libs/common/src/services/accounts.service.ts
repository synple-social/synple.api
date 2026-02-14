import { Injectable } from "@nestjs/common";
import { CreateAccountDto } from "apps/registrations/src/accounts/dto/create-account.dto";
import { RegistrationsService } from "./registrations.service";
import { InjectModel } from "@nestjs/mongoose";
import { Account } from "@synple/models/account.model";
import { Model } from "mongoose";
import { BadParameterException } from "@synple/utils/exceptions/bad-parameter.exception";
import { UsernameAlreadyExistingException } from "@synple/utils";

@Injectable()
export class AccountsService {

  constructor(
    @InjectModel(Account.name) public readonly model: Model<Account>,
    private readonly registrationService: RegistrationsService
  ) { }

  async create({ email, registrationId, username, password, passwordConfirmation }: CreateAccountDto) {
    const registration = await this.registrationService.findOrFail({ email, id: registrationId })
    if (password !== passwordConfirmation) throw new BadParameterException('passwordConfirmation', 'not-matching')
    if (await this.model.countDocuments({ username }) > 0) throw new UsernameAlreadyExistingException()
    return await this.model.create({ username, email, passwordDigest: 'a', registration })
  }
}