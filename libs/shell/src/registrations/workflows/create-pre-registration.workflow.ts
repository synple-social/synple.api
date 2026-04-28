import { preRegistration, PreRegistration } from "@synple/core/registrations/pre-registration";
import { validatePreRegistration } from "@synple/core/registrations/pre-registration.validator";
import { Errors } from "@synple/core/utils/errors.enum";
import { Monad } from "@synple/results/monads/monad.interface";

type PreRegistrationDto = { email: string, confirmationCode: string }

export function createPreRegistration({ email, confirmationCode }: PreRegistrationDto): Monad<PreRegistration, Errors> {
  return preRegistration(email, confirmationCode)
    .bind(validatePreRegistration)
}

export async function persistPreRegistration(preRegistration: PreRegistration) {
  
}