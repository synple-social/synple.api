import { Column, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
import { PreRegistration } from './pre-registration.entity';
import { Account } from './account.entity';

@Table
export class Registration extends Model {
  @Column
  declare email: string;

  @Column({ defaultValue: () => new Date() })
  declare lastValidatedAt: Date;

  @Column
  declare uuid: string;

  @HasMany(() => PreRegistration, { constraints: false })
  declare preRegistrations: PreRegistration[];

  @HasOne(() => Account, { constraints: false })
  declare account: Account;

  declare getPreRegistrations: () => Promise<PreRegistration[]>;
}
