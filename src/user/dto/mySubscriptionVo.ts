import { SubscriptionHistoryVo } from './user-subscription-responseDto/subscriptionHistoryVo';
import { PlatformVo } from 'src/category/dto/platformVo';

export class MySubscriptionVo {
  id: number;
  platformId: number;
  period: number;
  price: number;
  paymentMethod: string;
  startedDate: string;
  nextPayAt: Date;
  image: string;
  subscriptionHistoryVo?: SubscriptionHistoryVo;
  platform?: PlatformVo;

  constructor(
    id: number,
    platformId: number,
    period: number,
    price: number,
    paymentMethod: string,
    startedDate: string,
    nextPayAt: Date,
    image: string,
    subscriptionHistoryVo?: SubscriptionHistoryVo,
    platform?: PlatformVo,
  ) {
    this.id = id;
    this.platformId = platformId;
    this.period = period;
    this.price = price;
    this.paymentMethod = paymentMethod;
    this.startedDate = startedDate;
    this.nextPayAt = nextPayAt;
    this.image = image;
    this.subscriptionHistoryVo = subscriptionHistoryVo;
    this.platform = platform;
  }
}
