import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Scope } from '@synple/common/entities/admin/scope.entity';
import { CreateScopeDto } from 'apps/admin/src/scopes/dto/create-scope.dto';
import { UuidsService } from '../uuids.service';

@Injectable()
export class ScopesService {
  constructor(
    @InjectModel(Scope) public readonly model: typeof Scope,
    private uuids: UuidsService
  ) { }

  public async list(): Promise<Scope[]> {
    return await this.model.findAll({});
  }

  public async create({ slug, description }: CreateScopeDto): Promise<Scope> {
    return await this.model.create({ slug, description: description ?? "" })
  }
}
