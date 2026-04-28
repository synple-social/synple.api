import { success } from "@synple/results/monads/result.type";
import { Errors } from "../utils/errors.enum";
import { Success } from "@synple/results/monads/success.class";

/**
 * A pre registration is the first step in creating a whole registration, and an account after that.
 * It only provides a validation code and an email, so that the user can confirm the email they have
 * provided is effectively theirs.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export class PreRegistration {
  public constructor(
    public readonly email: string,
    public readonly confirmationCode: string,
  ) {}
}

export function preRegistration(email: string, confirmationCode: string): Success<PreRegistration, Errors> {
  return success(new PreRegistration(email, confirmationCode))
}