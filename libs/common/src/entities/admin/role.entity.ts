import { Exclude, Expose } from 'class-transformer';
import {
  BelongsToMany,
  Column,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Scope } from './scope.entity';
import { Account } from '../account.entity';
import { RoleScope } from '../relations/role-scope.entity';

/**
 * A role gathers informations about permissions a set of users can have in the application.
 * It contains scopes, and informations like the number of synthesizers a user can create.
 * A user can only have one role at a time, but roles can overlap in terms of scopes.
 */

@Exclude()
@Table
export class Role extends Model {
  @Column
  @Expose()
  declare name: string;

  @Column
  @Expose()
  declare isDefault: boolean;

  @Column
  @Expose()
  declare uuid: string;

  @BelongsToMany(() => Scope, () => RoleScope)
  declare scopes: Scope[];

  @HasMany(() => Account)
  declare accounts: Account[];

  declare getScopes: () => Promise<Scope[]>
}
