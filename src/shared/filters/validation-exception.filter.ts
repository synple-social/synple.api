import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common"
import Mongoose from "mongoose"

@Catch(Mongoose.Error.ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch({ errors }: Mongoose.Error.ValidationError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()
    const error = Object.values(errors)[0]
    response.status(400).json({ path: error.path, details: error.kind })
  }
}