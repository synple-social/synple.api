import { Controller, HttpCode, Post } from "@nestjs/common";
import { ApiNoContentResponse, ApiTags } from "@nestjs/swagger";
import { InitService } from "@synple/common/services/admin/init.service";

@Controller('init')
@ApiTags('Initialization')
export class InitController {

  constructor(private service: InitService) {}

  @Post('/')
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'The initialization has been correctly made and you can now log in with the created account'
  })
  public async run() {
    if (await this.service.shouldRun()) await this.service.run()
  }
}