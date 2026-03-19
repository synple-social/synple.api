import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
  Validate,
} from 'sequelize-typescript';
import { Registration } from './registration.entity';
import { PasswordRequest } from './password-request.entity';
import { Token } from './token.entity';
import { Role } from './admin/role.entity';
import { Exclude, Expose } from 'class-transformer';

@Table
@Exclude()
export class Account extends Model {
  @Column
  @Expose()
  declare email: string;

  @Validate({ len: { msg: 'length', args: [6, 256] } })
  @Column
  @Expose()
  declare username: string;

  @Column
  declare passwordDigest: string;

  @Column
  @Expose()
  declare uuid: string;

  @Column
  declare jwtSecret: string;

  @BelongsTo(() => Registration, { constraints: false })
  declare registration: Registration;

  @ForeignKey(() => Registration)
  @Column
  declare registrationId?: number;

  @HasMany(() => PasswordRequest, { constraints: false })
  declare passwordRequests: PasswordRequest[];

  @HasMany(() => Token)
  declare tokens: Token[];

  @BelongsTo(() => Role)
  declare role: Role;

  @ForeignKey(() => Role)
  declare roleId: number;
}
