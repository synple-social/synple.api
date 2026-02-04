import { Injectable } from "@nestjs/common";
import { EMAIL_SENDER } from "../../../src/utils/constants";
import { createTransport } from "../../../src/utils/mailer/createTransport";
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
  async send({ subject, content: text, to }: MailPayload) {
    const transporter = await createTransport()
    const sentMail = await transporter.sendMail({ from: EMAIL_SENDER, to, subject, text })
    console.log(nodemailer.getTestMessageUrl(sentMail))
  }
}