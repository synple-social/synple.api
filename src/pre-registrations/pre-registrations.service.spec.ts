import { Test, TestingModule } from '@nestjs/testing';
import { PreRegistrationsService } from './pre-registrations.service';

describe('PreRegistrationsService', () => {
  let service: PreRegistrationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreRegistrationsService],
    }).compile();

    service = module.get<PreRegistrationsService>(PreRegistrationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
