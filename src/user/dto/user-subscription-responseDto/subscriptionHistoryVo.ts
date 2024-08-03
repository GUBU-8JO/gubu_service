export class SubscriptionHistoryVo {
  id: number;
  userSubscriptionId: number;
  price: number;
  startAt: Date;
  nextPayAt: Date;
  stopRequestedAt: Date;

  constructor(
    id: number,
    userSubscriptionId: number,
    price: number,
    startAt: Date,
    nextPayAt: Date,
    stopRequestedAt: Date,
  ) {
    this.id = id;
    this.userSubscriptionId = userSubscriptionId;
    this.price = price;
    this.startAt = startAt;
    this.nextPayAt = nextPayAt;
    this.stopRequestedAt = stopRequestedAt;
  }
}
