import { Injectable } from '@nestjs/common';
import { createTransport } from 'src/utils/mailer/createTransport';
import nodemailer from "nodemailer"
import { InjectModel } from '@nestjs/mongoose';
import { PreRegistration, PreRegistrationDocument } from './models/pre-registration';
import { Model } from 'mongoose';

@Injectable()
export class PreRegistrationsService {

  constructor(@InjectModel(PreRegistration.name) private PreRegistrationModel: Model<PreRegistration>) { }

  async create(email: string) {
    await this.invalidateAll(email)
    const preRegistration: PreRegistrationDocument = await this.PreRegistrationModel.create({ email })

    const transporter = await createTransport()
    const sentMail = await transporter.sendMail({
      from: 'Synple <no-reply@synple.app>',
      to: email,
      subject: 'Subscription confirmation',
      text: `You're confirmation code is ${preRegistration.confirmationCode}`,
    })
    console.log(nodemailer.getTestMessageUrl(sentMail))
  }

  private async invalidateAll(email: string) {
    await this.PreRegistrationModel.updateMany({ email, invalidated: false }, { $set: { invalidated: true } })
  }
}
