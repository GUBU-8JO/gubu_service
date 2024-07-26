import { Injectable } from '@nestjs/common';
import { CreateSubscriptionHistoryDto } from './dto/create-subscription-history.dto';
import { UpdateSubscriptionHistoryDto } from './dto/update-subscription-history.dto';

@Injectable()
export class SubscriptionHistoriesService {
  create(createSubscriptionHistoryDto: CreateSubscriptionHistoryDto) {
    return 'This action adds a new subscriptionHistory';
  }

  findAll() {
    return `This action returns all subscriptionHistories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscriptionHistory`;
  }

  update(id: number, updateSubscriptionHistoryDto: UpdateSubscriptionHistoryDto) {
    return `This action updates a #${id} subscriptionHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscriptionHistory`;
  }
}
