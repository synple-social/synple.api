import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common"
import { UsernameAlreadyExistingException } from "@synple/utils"

/**
 * Catches and analyses ONLY the mongoDB server errors. The pattern to catch ALL errors, then check the type is
 * NOT the correct way of handling error, but as mongoose does not provide access to the internal error class of
 * its mongoDB library, that's the only way we found to ensure catching this exception correctly.
 * 
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
@Catch(UsernameAlreadyExistingException)
export class UsernameAlreadyExistingFilter implements ExceptionFilter {
  catch(err: UsernameAlreadyExistingException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()
    response.status(400).json({ path: 'username', error: 'unique' })
  }
}