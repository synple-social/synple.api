import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common"
import { ValidationError } from "@sequelize/core"

@Catch(Error)
export class ValidationExceptionFilter implements ExceptionFilter {

  catch(err: Error, host: ArgumentsHost) {
    if (err.constructor.name !== 'ValidationError') return;

    const castedError = err as unknown as ValidationError;
    const response = host.switchToHttp().getResponse()
    const error = castedError.errors[0]
    response.status(400).json({ path: error.path, error: error.message })
  }
}