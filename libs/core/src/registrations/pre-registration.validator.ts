import { EMAIL_FORMAT } from "@synple/utils";
import { PreRegistration } from "./pre-registration";
import { failure, Result, success } from "../utils/results";
import { Errors } from "../utils/errors.enum";

export class PreRegistrationValidator {
  public static validate(preRegistration: PreRegistration): Result<PreRegistration, Errors> {
    return success(preRegistration)
      .bind(this.validateEmailFormat)
  }

  public static validateEmailFormat(preRegistration: PreRegistration): Result<PreRegistration, Errors> {
    if (!preRegistration.email.match(EMAIL_FORMAT)) {
      return failure(Errors.EMAIL_FORMAT)
    }
    return success(preRegistration)
  }
}