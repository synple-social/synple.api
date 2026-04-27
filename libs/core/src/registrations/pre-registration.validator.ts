import { EMAIL_FORMAT } from "@synple/utils";
import { PreRegistration } from "./pre-registration";
import { Errors } from "../utils/errors.enum";
import { Result, success, failure } from "@synple/results/monads/result.type";
import { Monad } from "@synple/results/monads/monad.interface";

type Validator = (p: PreRegistration) => Result<PreRegistration, Errors>

export function validatePreRegistration(preRegistration: PreRegistration): Monad<PreRegistration, Errors> {
  return success<PreRegistration, Errors>(preRegistration)
      .bind(validateEmail)
      .bind(validateConfirmationCode)
}

const validateEmail: Validator = p => {
  return p.email.match(EMAIL_FORMAT) ? success(p) : failure(Errors.EMAIL_FORMAT)
}

const validateConfirmationCode: Validator = p => {
  return p.confirmationCode.match(/^[0-9A-Z]{6}$/i) ? success(p) : failure(Errors.CONFIRMATION_CODE_FORMAT)
}