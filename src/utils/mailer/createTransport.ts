import nodemailer from "nodemailer"

export async function createTransport() {
  const { smtp, user, pass } = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: smtp.host, port: smtp.port, secure: smtp.secure, auth: { user, pass }
  })
}