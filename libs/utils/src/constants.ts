export const EMAIL_FORMAT =
  /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;
export const EMAIL_SENDER = 'Synple <no-reply@synple.app>';
export const SALT_ROUNDS = 8;
export const UUID_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i