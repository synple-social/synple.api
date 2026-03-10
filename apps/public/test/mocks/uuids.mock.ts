import { UuidsService } from '@synple/common/services/uuids.service';
import { v7 } from 'uuid';

// A new one is generated with each test, and used as all UUIDs
export const TEST_UUID = v7();

export class UuidsMock extends UuidsService {
  public generate() {
    return TEST_UUID;
  }
}
