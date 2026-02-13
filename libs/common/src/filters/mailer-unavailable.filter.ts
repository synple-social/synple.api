import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common"
import { MailerUnavailableException } from "@synple/utils"

@Catch(MailerUnavailableException)
export class MailerUnavailableFilter implements ExceptionFilter {

  catch(_: MailerUnavailableException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()
    response.status(422).json({ path: 'mailer', error: 'unavailable' })
  }
}