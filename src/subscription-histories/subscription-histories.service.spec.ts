import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionHistoriesService } from './subscription-histories.service';

describe('SubscriptionHistoriesService', () => {
  let service: SubscriptionHistoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionHistoriesService],
    }).compile();

    service = module.get<SubscriptionHistoriesService>(SubscriptionHistoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
