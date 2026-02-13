import { Body, Controller, Header, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateAccountDto } from "./dto/create-account.dto";
import { AccountsService } from "@synple/common/services/accounts.service";

@Controller('accounts')
@ApiTags('accounts')
export class AccountsController {

  constructor(private readonly service: AccountsService) { }

  @Post()
  @Header('Content-Type', 'application/json')
  async create(@Body() body: CreateAccountDto) {
    await this.service.create(body)
  }
}