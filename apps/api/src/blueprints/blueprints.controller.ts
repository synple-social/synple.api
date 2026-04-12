import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CreateBlueprintDto } from "./dto/create-blueprint.dto";
import { BlueprintsService } from "@synple/common/services/blueprints.service";

@Controller('/:uuid/blueprints')
export class BlueprintsController {

  constructor(private service: BlueprintsService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() { name, slots }: CreateBlueprintDto) {
    return await this.service.create({ name, slots })
  }
}