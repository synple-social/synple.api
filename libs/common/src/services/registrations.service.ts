import { Injectable } from "@nestjs/common";
import { PreRegistrationDocument, Registration, RegistrationDocument } from "@synple/models";
import { PreRegistrationsService } from "./pre-registrations.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class RegistrationsService {

  constructor(
    @InjectModel(Registration.name) public readonly model: Model<Registration>,
    private readonly preRegistrationsService: PreRegistrationsService
  ) { }

  async create(email: string, confirmationCode: string): Promise<RegistrationDocument> {
    const preRegistration: PreRegistrationDocument = await this.preRegistrationsService.findOrFail({ email, confirmationCode })
    return await this.model.create({ preRegistration })
  }
}