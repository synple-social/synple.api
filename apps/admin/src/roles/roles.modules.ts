import { Module } from "@nestjs/common";
import { RolesController } from "./roles.controller";
import { RolesService } from "@synple/common/services/admin/roles.service";
import { UuidsService } from "@synple/common";

@Module({
  controllers: [RolesController],
  providers: [RolesService, UuidsService]
})
export class RolesModule { }