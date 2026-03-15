import { Controller, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthenticationGuard } from "@synple/common";

@Controller('/')
@ApiTags('Tools')
export class ToolsController {
  @Post('/')
  @UseGuards(AuthenticationGuard)
  public async create() {
    return { created: true }
  }
}