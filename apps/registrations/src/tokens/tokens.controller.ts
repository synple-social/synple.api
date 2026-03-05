import { Body, Controller, Post, UseFilters } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateTokenDto } from "./dto/create-token.dto";
import { TokensService } from "@synple/common";
import { InvalidCredentialsFilter } from "@synple/common/filters/invalid-credentials.filter";

@Controller('tokens')
@ApiTags('Authentication')
export class TokensController {

  constructor(private service: TokensService) { }

  @Post('/')
  @UseFilters(InvalidCredentialsFilter)
  public async create(@Body() { email, password }: CreateTokenDto) {
    const { token } = await this.service.create(email, password)
    return { token }
  }
}