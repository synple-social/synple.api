import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Account } from "@synple/common/entities";
import { Role } from "@synple/common/entities/admin/role.entity";
import { CreateRoleDto } from "apps/admin/src/roles/dto/create-role.dto";
import { UuidsService } from "../uuids.service";

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) public readonly model: typeof Role,
    @InjectModel(Account) public readonly accounts: typeof Account,
    private uuid: UuidsService,
  ) { }
  
  public async create({ name, isDefault }: CreateRoleDto): Promise<Role> {
    await this.resetDefault()
    return await this.model.create({ name, isDefault, uuid: this.uuid.generate() })
  }

  public async delete(uuid: string) {
    const role = await this.model.findOne({ where: { uuid } })
    if (role === null) return
    if (role.dataValues.isDefault) throw new UnprocessableEntityException({ path: 'uuid', error: 'default' })
    await this.transferUsersFrom(role)
    await this.model.update({ deleteAt: new Date() }, { where: { id: role.id }})
  }

  private async resetDefault() {
    await this.model.update({ isDefault: false }, { where: { isDefault: true } })
  }

  private async transferUsersFrom(role: Role) {
    const defaultRole = await this.model.findOne({ where: { isDefault: true } }) as Role
    this.accounts.update({ roleId: defaultRole.id }, { where: { roleId: role.id }})
  }
}