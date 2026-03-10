import { ConfirmationCodesService } from '@synple/common';

export class ConfirmationCodesMock extends ConfirmationCodesService {
  public generate(): string {
    return 'ABC123';
  }
}
