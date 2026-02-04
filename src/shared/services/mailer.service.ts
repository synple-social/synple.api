import { Injectable } from "@nestjs/common";
import { EMAIL_SENDER } from "../../../src/utils/constants";
import nodemailer from "nodemailer"

export type MailPayload = {
  to: string
  subject: string
  content: string
}

/**
 * This service holds the logic to send mails to users when creating a pre-registration, or completing
 * a registration. It does not create the transport layer for the mail, but uses it to format mails.
 * 
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
@Injectable()
export class MailerService {

  private transporter

  async send({ subject, content: text, to }: MailPayload) {
    if (this.transporter === undefined) {
      this.transporter = await this.createTransport()
    }
    const sentMail = await this.transporter.sendMail({ from: EMAIL_SENDER, to, subject, text })
    console.log(nodemailer.getTestMessageUrl(sentMail))
  }

  private async createTransport() {
    const { smtp, user, pass } = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: smtp.host, port: smtp.port, secure: smtp.secure, auth: { user, pass }
    })
  }
}