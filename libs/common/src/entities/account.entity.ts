import { Column, HasOne, Model, Table, Validate } from "sequelize-typescript"
import { Registration } from "./registration.entity"

@Table
export class Account extends Model {
  @Column
  declare email: string

  @Validate({ len: { msg: 'length', args: [6, 256] } })
  @Column
  declare username: string

  @Column
  declare passwordDigest: string

  @HasOne(() => Registration)
  declare registration: Registration
}