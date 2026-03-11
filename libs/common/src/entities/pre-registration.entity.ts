import { generateConfirmationCode } from '@synple/utils';
import {
  Table,
  Column,
  Model,
  ForeignKey,
  Validate,
  Scopes,
  BelongsTo,
} from 'sequelize-typescript';
import { Registration } from './registration.entity';
import { Op } from '@sequelize/core';

@Scopes(() => ({
  valid: { where: { invalidatedAt: null } },
  invalid: { where: { invalidatedAt: { [Op.ne]: null } } },
}))
@Table
export class PreRegistration extends Model {
  @Validate({ isEmail: { msg: 'format' } })
  @Column
  declare email: string;

  @Column
  declare uuid: string;

  @Column({ defaultValue: () => generateConfirmationCode() })
  declare confirmationCode?: string;

  @Column({ defaultValue: () => new Date() })
  declare sentAt?: Date;

  @Column({ defaultValue: () => null })
  declare invalidatedAt?: Date;

  @BelongsTo(() => Registration, { constraints: false })
  declare registration?: Registration;

  @ForeignKey(() => Registration)
  @Column
  declare registrationId?: number;
}
