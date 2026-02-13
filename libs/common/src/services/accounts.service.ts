import { Injectable } from "@nestjs/common";
import { CreateAccountDto } from "apps/registrations/src/accounts/dto/create-account.dto";

@Injectable()
export class AccountsService {
  async create({ email, registrationId, username, password, passwordConfirmation }: CreateAccountDto) {

  }
}