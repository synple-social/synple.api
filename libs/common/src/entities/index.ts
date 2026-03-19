import { DynamicModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from './account.entity';
import { PreRegistration } from './pre-registration.entity';
import { Registration } from './registration.entity';
import { PasswordRequest } from './password-request.entity';
import { Token } from './token.entity';
import { Scope } from './admin/scope.entity';
import { Role } from './admin/role.entity';
import { RoleScope } from './relations/role-scope.entity';

export * from './account.entity';
export * from './admin/role.entity';
export * from './admin/scope.entity';
export * from './password-request.entity';
export * from './pre-registration.entity';
export * from './registration.entity';
export * from './relations/role-scope.entity';
export * from './token.entity';

export const EntitiesModule: DynamicModule = {
  ...SequelizeModule.forFeature([
    Account,
    PasswordRequest,
    PreRegistration,
    Registration,
    Role,
    RoleScope,
    Scope,
    Token,
  ]),
  global: true,
};
