import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { InvalidCredentialsException } from '@synple/utils/exceptions/invalid-credentials.exception';

@Catch(InvalidCredentialsException)
export class InvalidCredentialsFilter implements ExceptionFilter {
  catch(_: InvalidCredentialsException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(403).json({ path: 'credentials', error: 'unknown' });
  }
}
