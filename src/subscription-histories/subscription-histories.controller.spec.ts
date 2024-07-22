import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionHistoriesController } from './subscription-histories.controller';
import { SubscriptionHistoriesService } from './subscription-histories.service';

describe('SubscriptionHistoriesController', () => {
  let controller: SubscriptionHistoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionHistoriesController],
      providers: [SubscriptionHistoriesService],
    }).compile();

    controller = module.get<SubscriptionHistoriesController>(SubscriptionHistoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
