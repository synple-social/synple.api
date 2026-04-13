import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Registration } from '@synple/common/entities';
import { DocumentNotFoundException } from '@synple/utils';

@Injectable()
export class FindRegistrationsService {
  constructor(
    @InjectModel(Registration) public readonly model: typeof Registration,
  ) {}

  async findOrFail({
    email,
    uuid,
  }: Partial<Registration>): Promise<Registration> {
    const found = await this.model.findOne({ where: { email, uuid } });
    if (found === null) throw new DocumentNotFoundException('email');
    return found;
  }
}
