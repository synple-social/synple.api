import { Injectable } from "@nestjs/common";
import { Registration, RegistrationDocument } from "@synple/models";
import { PreRegistrationsService } from "./pre-registrations.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DocumentNotFoundException } from "@synple/utils";

@Injectable()
export class RegistrationsService {

  constructor(
    @InjectModel(Registration.name) public readonly model: Model<Registration>,
    private readonly preRegistrationsService: PreRegistrationsService
  ) { }

  async create(email: string, confirmationCode: string): Promise<RegistrationDocument> {
    await this.preRegistrationsService.findOrFail({ email, confirmationCode })
    const registration: RegistrationDocument | null = await this.model.findOne({ email })
    return registration || await this.model.create({ email })
  }

  async findOrFail({ email, id }: { email: string, id: string }): Promise<RegistrationDocument> {
    const found = await this.model.findOne({ email, id })
    if (found === null) throw new DocumentNotFoundException('email')
    return found
  }
}