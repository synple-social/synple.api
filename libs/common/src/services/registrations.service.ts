import { Injectable } from "@nestjs/common";
import { PreRegistrationsService } from "./pre-registrations.service";
import { DocumentNotFoundException } from "@synple/utils";
import { Registration } from "../entities/registration.entity";
import { InjectModel } from "@nestjs/sequelize";
import { PreRegistration } from "../entities";

@Injectable()
export class RegistrationsService {

  constructor(
    @InjectModel(Registration) public readonly model: typeof Registration,
    private readonly preRegistrationsService: PreRegistrationsService
  ) { }

  async create(email: string, confirmationCode: string): Promise<Registration> {
    const preRegistration = await this.preRegistrationsService.findOrFail({ email, confirmationCode })
    const registration = await this.findOrCreate(email, preRegistration)
    return registration
  }

  async findOrFail({ email, id }: { email: string, id: string }): Promise<Registration> {
    const found = await this.model.findOne({ where: { email } })
    if (found === null || found.id !== id) throw new DocumentNotFoundException('email')
    return found
  }

  async findOrCreate(email: string, preRegistration: PreRegistration): Promise<Registration> {
    const registration: Registration = await this.model.findOne({ where: { email } }) || await this.model.create({ email })
    await preRegistration.set('registrationId', registration.id)
    await preRegistration.save()
    return registration
  }
}