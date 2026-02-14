import { Injectable } from "@nestjs/common";
import { CreateAccountDto } from "apps/registrations/src/accounts/dto/create-account.dto";
import { RegistrationsService } from "./registrations.service";
import { InjectModel } from "@nestjs/mongoose";
import { Account } from "@synple/models/account.model";
import { Model } from "mongoose";

@Injectable()
export class AccountsService {

  constructor(
    @InjectModel(Account.name) public readonly model: Model<Account>,
    private readonly registrationService: RegistrationsService
  ) { }

  async create({ email, registrationId, username, password, passwordConfirmation }: CreateAccountDto) {
    const registration = await this.registrationService.findOrFail({ email, id: registrationId })
  }
}