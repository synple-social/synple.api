import { Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

@Controller('/:uuid/blueprints')
export class BlueprintsController {
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  public async create() {
    return { created: true }
  }
}