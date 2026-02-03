import { Injectable } from '@nestjs/common';
import { createTransport } from 'src/utils/mailer/createTransport';
import nodemailer from "nodemailer"

@Injectable()
export class PreRegistrationsService {
  async create(email: string) {
    const transporter = await createTransport()
    const sentMail = await transporter.sendMail({
      from: 'Synple <no-reply@synple.app>',
      to: email,
      subject: 'Subscription confirmation',
      text: 'This is a test mail',
    })
    console.log(nodemailer.getTestMessageUrl(sentMail))
  }
}
