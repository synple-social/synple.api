import { Body, Controller, HttpCode, Request, Post, UseFilters, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateTokenDto } from "./dto/create-token.dto";
import { AuthenticationGuard, TokensService } from "@synple/common";
import { InvalidCredentialsFilter } from "@synple/common/filters/invalid-credentials.filter";
import { InvalidTokenFilter } from "@synple/common/filters/invalid-token.filter";

@Controller('/auth')
@ApiTags("Authentication")
export class TokensController {

  constructor(private service: TokensService) { }

  @Post('/signin')
  @UseFilters(InvalidCredentialsFilter)
  public async create(@Body() { email, password }: CreateTokenDto) {
    return { token: await this.service.create(email, password) }
  }

  @Post('/signout')
  @UseFilters(InvalidTokenFilter)
  @UseGuards(AuthenticationGuard)
  @HttpCode(204)
  public async delete(@Request() request) {
    await this.service.invalidate(request.jwtToken.jti)
  }
}