import { Exclude, Expose } from "class-transformer";
import { Column, Model, Table } from "sequelize-typescript";

@Table
@Exclude()
export class Blueprint extends Model {
  @Column
  @Expose()
  declare name: string

  @Column
  @Expose()
  declare slots: number
}