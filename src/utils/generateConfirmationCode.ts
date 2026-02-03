/**
 * Creates a confirmation code containing only numbers and uppercase letters.
 * @param size The number of characters to put in the confirmation code
 * @returns the confirmation code as a string
 */
export function generateConfirmationCode(size: number = 6): string {
  return Array.from(Array(6)).map(createRandomCharacter).join('')
}

/**
 * Generates a random chjaracter, being either a number (0-9) or an uppercase letter (A-Z)
 * @returns The generated character as a one-character long string
 */
function createRandomCharacter() {
  const position = Math.floor(Math.random() * 36)
  return String.fromCharCode((position >= 10 ? 55 : 48) + position)
}