import { Module } from "@nestjs/common";
import { BlueprintsController } from "./blueprints.controlle";

@Module({
  controllers: [ BlueprintsController]
})
export class BlueprintsModule { }