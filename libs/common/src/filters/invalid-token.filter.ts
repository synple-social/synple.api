import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common"
import { InvalidTokenException } from "@synple/utils"

@Catch(InvalidTokenException)
export class InvalidTokenFilter implements ExceptionFilter {

  catch(_: InvalidTokenException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()
    response.status(400).json({ path: 'token', error: 'forbidden' })
  }
}