import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { Exclude, Expose } from 'class-transformer';
import { RoleScope } from '../relations/role-scope.entity';
import { Role } from './role.entity';

@Table
@Exclude()
export class Scope extends Model {

  @Column
  @Expose()
  declare slug: string;

  @Column
  @Expose()
  declare description: string;

  @BelongsToMany(() => Role, () => RoleScope)
  declare roles: Role[];
}
