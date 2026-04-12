import { Body, ClassSerializerInterceptor, Controller, HttpCode, HttpStatus, Post, UseInterceptors, UsePipes } from "@nestjs/common";
import { CreateBlueprintDto } from "./dto/create-blueprint.dto";
import { BlueprintsService } from "@synple/common/services/blueprints.service";
import { transformErrorPipe } from "@synple/common";

@Controller('/:uuid/blueprints')
export class BlueprintsController {

  constructor(private service: BlueprintsService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(transformErrorPipe)
  public async create(@Body() { name, slots }: CreateBlueprintDto) {
    return await this.service.create({ name, slots })
  }
}