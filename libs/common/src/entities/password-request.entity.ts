import { Op } from '@sequelize/core';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Scopes,
  Table,
  Validate,
} from 'sequelize-typescript';
import { Account } from './account.entity';

@Scopes(() => ({
  valid: { where: { invalidatedAt: null } },
  invalid: { where: { invalidatedAt: { [Op.ne]: null } } },
}))
@Table
export class PasswordRequest extends Model {
  @Validate({ isEmail: { msg: 'format' } })
  @Column
  declare email: string;

  @Column
  declare confirmationCode: string;

  @Column({ defaultValue: () => null })
  declare invalidatedAt?: Date;

  @BelongsTo(() => Account)
  declare account: Account;

  @ForeignKey(() => Account)
  @Column
  declare accountId: number;
}
