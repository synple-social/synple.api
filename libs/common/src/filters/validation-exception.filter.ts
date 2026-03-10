import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ValidationError } from 'sequelize';

@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch({ errors }: ValidationError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response
      .status(400)
      .json({ path: errors[0].path, error: errors[0].message });
  }
}
