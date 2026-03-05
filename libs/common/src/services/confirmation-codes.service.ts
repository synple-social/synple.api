import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfirmationCodesService {
  public generate(): string {
    return Array.from(Array(6)).map(this.createRandomCharacter).join('')
  }
  private createRandomCharacter() {
    const position = Math.floor(Math.random() * 36)
    return String.fromCharCode((position >= 10 ? 55 : 48) + position)
  }
}