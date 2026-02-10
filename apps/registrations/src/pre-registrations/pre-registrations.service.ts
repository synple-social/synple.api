import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PreRegistration, PreRegistrationDocument } from '@synple/models'
import { Model } from 'mongoose';
import { MailerService } from '@synple/utils'

@Injectable()
export class PreRegistrationsService {

  constructor(
    @InjectModel(PreRegistration.name) public readonly model: Model<PreRegistration>,
    private mailerService: MailerService 
  ) {}

  async create(email: string) {
    await this.invalidateAll(email)
    const preRegistration: PreRegistrationDocument = await this.model.create({ email })
    console.log(await this.model.db.config)
    const subject = 'Subscription confirmation'
    const content = `You're confirmation code is ${preRegistration.confirmationCode}`
    try {
      await this.mailerService.send({subject, content, to: email})
    }
    catch(exception) {
      console.log(`[PREREGISTRATION::CREATE::EMAIL][${exception}]`)
    }
  }

  private async invalidateAll(email: string) {
    await this.model.updateMany({ email, invalidated: false }, { $set: { invalidated: true } })
  }
}
