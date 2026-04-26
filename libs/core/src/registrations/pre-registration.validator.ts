import { EMAIL_FORMAT } from "@synple/utils";
import { PreRegistration } from "./pre-registration";
import { Errors } from "../utils/errors.enum";
import { Result, success, failure } from "@synple/results/monads/result.type";
import { Monad } from "@synple/results/monads/monad.interface";

export class PreRegistrationValidator {
  public static validate(preRegistration: PreRegistration): Monad<PreRegistration, Errors> {
    return success<PreRegistration, Errors>(preRegistration)
      .bind(this.validateEmailFormat)
  }

  public static validateEmailFormat(preRegistration: PreRegistration): Result<PreRegistration, Errors> {
    if (!preRegistration.email.match(EMAIL_FORMAT)) {
      return failure(Errors.EMAIL_FORMAT)
    }
    return success(preRegistration)
  }
}