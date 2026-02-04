import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common"

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    console.log(error)
  }
}