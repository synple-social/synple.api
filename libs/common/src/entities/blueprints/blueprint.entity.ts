import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table
@Exclude()
export class Blueprint extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @Expose()
  declare id: string;

  @Column
  @Expose()
  declare name: string;

  @Column
  @Expose()
  declare slots: number;
}
