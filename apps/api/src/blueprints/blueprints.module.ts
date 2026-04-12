import { Module } from "@nestjs/common";
import { BlueprintsController } from "./blueprints.controller";
import { BlueprintsService } from "@synple/common/services/blueprints.service";

@Module({
  controllers: [ BlueprintsController],
  providers: [ BlueprintsService ],
})
export class BlueprintsModule { }