import { Injectable } from '@nestjs/common';
import { createTransport } from 'src/utils/mailer/createTransport';
import nodemailer from "nodemailer"
import { InjectModel } from '@nestjs/mongoose';
import { PreRegistration } from './models/pre-registration';
import { Model } from 'mongoose';

@Injectable()
export class PreRegistrationsService {

  constructor(@InjectModel(PreRegistration.name) private PreRegistrationModel: Model<PreRegistration>) { }

  async create(email: string) {
    const preRegistration = new this.PreRegistrationModel({})
    // if (preRegistration.$isValid) await preRegistration.save()
    try {
      await this.PreRegistrationModel.init()
      await this.PreRegistrationModel.create({ email })

      const transporter = await createTransport()
      const sentMail = await transporter.sendMail({
        from: 'Synple <no-reply@synple.app>',
        to: email,
        subject: 'Subscription confirmation',
        text: `You're confirmation code is ${preRegistration.confirmationCode}`,
      })
      console.log(nodemailer.getTestMessageUrl(sentMail))
    }
    catch (exception) {
      console.log("[PREREGISTRATION::CREATION] Duplicate value found for email")
    }
  }
}
