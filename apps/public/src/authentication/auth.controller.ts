import { Body, Controller, HttpCode, Request, Post, UseFilters, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiHeader, ApiNoContentResponse, ApiTags } from "@nestjs/swagger";
import { AuthSigninDto } from "./dto/auth-signin.dto";
import { AuthenticationGuard, TokensService } from "@synple/common";
import { InvalidCredentialsFilter } from "@synple/common/filters/invalid-credentials.filter";
import { InvalidTokenFilter } from "@synple/common/filters/invalid-token.filter";
import { createErrorSchema } from "@synple/utils";
import { signinSuccessSchema } from "./schemas/signin-success.schema";

@Controller('/auth')
@ApiTags("Authentication")
export class TokensController {

  constructor(private service: TokensService) { }

  @Post('/signin')
  @UseFilters(InvalidCredentialsFilter)
  @ApiCreatedResponse({
    description: 'The JWT has been correctly created and is returned in the response body for further use',
    schema: signinSuccessSchema
  })
  @ApiForbiddenResponse({
    description: 'The credentials you provided were incorrect. Either the email is unknown, or the password does not match the email.',
    schema: createErrorSchema('credentials', 'invalid')
  })
  public async create(@Body() { email, password }: AuthSigninDto) {
    return { token: await this.service.create(email, password) }
  }

  @Post('/signout')
  @UseFilters(InvalidTokenFilter)
  @UseGuards(AuthenticationGuard)
  @ApiHeader({
    name: 'Authentication',
    description: 'The bearer token use to authenticate this request.',
    example: 'Bearer <TOKEN>'
  })
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'The sign out process has been completed successfully, the token used is now considered invalid in any other request.'
  })
  @ApiBadRequestResponse({
    description: 'You did not provide a bearer token in the headers and the server could not determine which token to invalidate',
    schema: createErrorSchema('token', 'required'),
  })
  @ApiForbiddenResponse({
    description: 'The token you provided was not a valid token and could not be invalidated',
    schema: createErrorSchema('token', 'forbidden'),
  })
  public async delete(@Request() request) {
    await this.service.invalidate(request.jwtToken.jti)
  }
}