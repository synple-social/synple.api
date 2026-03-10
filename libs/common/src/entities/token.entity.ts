import { Op } from '@sequelize/core';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { Account } from './account.entity';

@Scopes(() => ({
  valid: { where: { invalidatedAt: null } },
  invalid: { where: { invalidatedAt: { [Op.ne]: null } } },
}))
@Table
export class Token extends Model {
  @Column({ defaultValue: () => null })
  declare invalidatedAt: Date;

  @Column
  declare uuid: string;

  @BelongsTo(() => Account)
  declare account: Account;

  @ForeignKey(() => Account)
  declare accountId: string;
}
