import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateBlueprintDto } from "apps/api/src/blueprints/dto/create-blueprint.dto";
import { Blueprint } from "../entities/blueprints/blueprint.entity";

@Injectable()
export class BlueprintsService {
  constructor(
      @InjectModel(Blueprint) public readonly model: typeof Blueprint
  ) {}
  public async create({ name, slots }: CreateBlueprintDto): Promise<Blueprint> {
    return await this.model.create({ name, slots })
  }
}