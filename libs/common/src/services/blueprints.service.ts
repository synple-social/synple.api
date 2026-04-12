import { Injectable } from "@nestjs/common";
import { CreateBlueprintDto } from "apps/api/src/blueprints/dto/create-blueprint.dto";

@Injectable()
export class BlueprintsService {
  public async create({ name, slots }: CreateBlueprintDto): Promise<{ created: boolean }> {
    return { created: true }
  }
}