import { Test, TestingModule } from '@nestjs/testing';
import { OrgenizationService } from './orgenization.service';

describe('OrgenizationService', () => {
  let service: OrgenizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrgenizationService],
    }).compile();

    service = module.get<OrgenizationService>(OrgenizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
