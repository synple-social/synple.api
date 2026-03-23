import { Role } from "@synple/common";
import { createFactory } from "../helpers/create-factory.helper";

export const roleFactory = createFactory<Role>(Role, {
  name: () => 'TestRole',
  uuid: () => '2',
  isDefault: () => false,
})