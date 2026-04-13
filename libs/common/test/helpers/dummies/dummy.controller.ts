import { Controller, Get, Module, SetMetadata, UseGuards } from "@nestjs/common";
import { AccountsService, AuthenticationGuard, ConfirmationCodesService, EntitiesModule, MailerService, PreRegistrationsService, RegistrationsService, TokensService } from "@synple/common";
import { RequiresScope } from "@synple/common/decorators/requires-scope.decorator";
import { AuthModule } from "apps/public/src/auth/auth.module";

/**
 * The controller is used to test the authentication guard.
 */

@Controller('/dummy')
export class DummyController {

  @Get('/')
  @RequiresScope("test::scope")
  @UseGuards(AuthenticationGuard)
  public async dummyRoute() {
    return { success: true }
  }
}

@Module({
  controllers: [ DummyController ],
  imports: [ AuthModule, EntitiesModule ],
  providers: [ TokensService, AccountsService, RegistrationsService, PreRegistrationsService, ConfirmationCodesService, MailerService],
})
export class DummyModule {}