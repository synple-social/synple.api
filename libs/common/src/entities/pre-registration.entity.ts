import { generateConfirmationCode } from '@synple/utils'
import { Table, Column, Model, BelongsTo, ForeignKey, IsEmail, Validate } from 'sequelize-typescript';
import { Registration } from './registration.entity';

@Table
export class PreRegistration extends Model {

  @Validate({ isEmail: { msg: 'format' } })
  @Column
  declare email: string

  @Column({ defaultValue: () => generateConfirmationCode() })
  declare confirmationCode?: string

  @Column({ defaultValue: () => new Date() })
  declare sentAt?: Date

  @Column({ defaultValue: false })
  declare invalidated?: boolean

  @ForeignKey(() => Registration)
  declare registration?: Registration
}