import { Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript"
import { PreRegistration } from "./pre-registration.entity"
import { Account } from "./account.entity"

@Table
export class Registration extends Model {
  @Column
  declare email: string

  @Column({ defaultValue: () => new Date() })
  declare lastValidatedAt: Date

  @HasMany(() => PreRegistration)
  declare preRegistrations: PreRegistration[]

  @ForeignKey(() => Account)
  declare account: Account
}