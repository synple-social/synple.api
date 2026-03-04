import { BelongsTo, Column, ForeignKey, HasMany, Model, Table, Validate } from "sequelize-typescript"
import { Registration } from "./registration.entity"
import { PasswordRequest } from "./password-request.entity"

@Table
export class Account extends Model {
  @Column
  declare email: string

  @Validate({ len: { msg: 'length', args: [6, 256] } })
  @Column
  declare username: string

  @Column
  declare passwordDigest: string

  @Column
  declare uuid: string

  @BelongsTo(() => Registration, { constraints: false })
  declare registration: Registration

  @ForeignKey(() => Registration)
  @Column
  declare registrationId?: number

  @HasMany(() => PasswordRequest, { constraints: false })
  declare passwordRequests: PasswordRequest[]
}