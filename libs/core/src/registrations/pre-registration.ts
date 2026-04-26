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