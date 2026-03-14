import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Scope } from '../admin/scope.entity';
import { Role } from '../admin/role.entity';

@Table
export class RoleScope extends Model {
  @ForeignKey(() => Scope)
  @Column
  declare scopeId: number;

  @ForeignKey(() => Role)
  @Column
  declare roleId: number;
}
