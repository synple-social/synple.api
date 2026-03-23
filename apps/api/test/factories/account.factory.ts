import { Account } from "@synple/common";
import { createFactory } from "../helpers/create-factory.helper";
import { hash } from "bcrypt";
import { SALT_ROUNDS } from "@synple/utils";

  export const accountFactory = createFactory<Account>(Account, {
    email: () => "test@synple.app",
    username: () => 'TestUsername',
    uuid: () => 'test uuid',
    passwordDigest: async () => await hash("password", SALT_ROUNDS),
  })