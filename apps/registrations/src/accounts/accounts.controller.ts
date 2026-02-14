import { Body, Controller, Header, Post, UseFilters } from "@nestjs/common";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { CreateAccountDto } from "./dto/create-account.dto";
import { AccountsService } from "@synple/common/services/accounts.service";
import { DocumentNotFoundFilter } from "@synple/common/filters/document-not-found.filter";
import { DocumentNotFoundException } from "@synple/utils";

@Controller('accounts')
@ApiTags('accounts')
export class AccountsController {

  constructor(private readonly service: AccountsService) { }

  @Post()
  @Header('Content-Type', 'application/json')
  @UseFilters(DocumentNotFoundFilter)
  @ApiCreatedResponse()
  async create(@Body() body: CreateAccountDto) {
    await this.service.create(body)
  }
}