import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PreRegistration, PreRegistrationDocument } from '@synple/models'
import { Model } from 'mongoose';
import { MailerService } from './mailer.service'
import { DocumentNotFoundException } from '@synple/utils';

@Injectable()
export class PreRegistrationsService {

  constructor(
    @InjectModel(PreRegistration.name) public readonly model: Model<PreRegistration>,
    private mailerService: MailerService 
  ) {}

  async create(email: string) {
    await this.invalidateAll(email)
    const preRegistration: PreRegistrationDocument = await this.model.create({ email })
    const subject = 'Subscription confirmation'
    const content = `You're confirmation code is ${preRegistration.confirmationCode}`
    try {
      await this.mailerService.send({subject, content, to: email})
    }
    catch(exception) {
      console.log(`[PREREGISTRATION::CREATE::EMAIL][${exception}]`)
    }
  }

  async findOrFail(filters: Partial<{ email: string, confirmationCode: string }>): Promise<PreRegistrationDocument> {
    const result = await this.model.findOne(filters)
    if (!result) throw new DocumentNotFoundException('email')
    return result
  }

  private async invalidateAll(email: string) {
    await this.model.updateMany({ email, invalidated: false }, { $set: { invalidated: true } })
  }
}
