import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common"
import { DocumentNotFoundException } from "@synple/utils"

@Catch(DocumentNotFoundException)
export class DocumentNotFoundFilter implements ExceptionFilter {

  catch(error: DocumentNotFoundException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()
    response.status(404).json({ path: error.path, error: 'unknown' })
  }
}