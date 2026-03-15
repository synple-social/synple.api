import { Controller, Post } from "@nestjs/common";

@Controller('/')
export class ToolsController {
  @Post('/')
  public async create() {
    return { created: true }
  }
}