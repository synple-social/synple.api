import { Injectable } from "@nestjs/common";
import { PreRegistrationsService } from "./pre-registrations.service";
import { DocumentNotFoundException } from "@synple/utils";
import { Registration } from "../entities/registration.entity";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class RegistrationsService {

  constructor(
    @InjectModel(Registration) public readonly model: typeof Registration,
    private readonly preRegistrationsService: PreRegistrationsService
  ) { }

  async create(email: string, confirmationCode: string): Promise<Registration> {
    await this.preRegistrationsService.findOrFail({ email, confirmationCode })
    const registration: Registration | null = await this.model.findOne({ where: { email } })
    return registration || await this.model.create({ email })
  }

  async findOrFail({ email, id }: { email: string, id: string }): Promise<Registration> {
    const found = await this.model.findOne({ where: { email } })
    if (found === null || found.id !== id) throw new DocumentNotFoundException('email')
    return found
  }
}