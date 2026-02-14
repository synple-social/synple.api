import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common"
import { BadParameterException } from "@synple/utils"

@Catch(BadParameterException)
export class BadParameterFilter implements ExceptionFilter {

  catch({ path, error }: BadParameterException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()
    response.status(400).json({ path, error })
  }
}