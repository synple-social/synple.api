import { Test, TestingModule } from '@nestjs/testing';
import { PreRegistrationsController } from './pre-registrations.controller';
import { PreRegistrationsService } from './pre-registrations.service';

describe('PreRegistrationsController', () => {
  let controller: PreRegistrationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreRegistrationsController],
      providers: [PreRegistrationsService],
    }).compile();

    controller = module.get<PreRegistrationsController>(PreRegistrationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
