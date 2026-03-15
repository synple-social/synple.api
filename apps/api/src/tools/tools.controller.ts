import { Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller('/')
@ApiTags('Tools')
export class ToolsController {
  @Post('/')
  public async create() {
    return { created: true }
  }
}