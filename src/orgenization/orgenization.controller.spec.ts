import { Test, TestingModule } from '@nestjs/testing';
import { OrgenizationController } from './orgenization.controller';
import { OrgenizationService } from './orgenization.service';

describe('OrgenizationController', () => {
  let controller: OrgenizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgenizationController],
      providers: [OrgenizationService],
    }).compile();

    controller = module.get<OrgenizationController>(OrgenizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
