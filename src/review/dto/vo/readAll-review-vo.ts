import { CreateReviewVo } from './create-review-vo';

export class ReadAllReviewVo extends CreateReviewVo {
  id: number;
  platformId: number;
  comment: string;
  rate: number;
  nickname: string;
  constructor(
    id: number,
    platformId: number,
    comment: string,
    rate: number,
    nickname: string,
  ) {
    super(platformId, rate, comment);
    this.id = id;
    this.platformId = platformId;
    this.comment = comment;
    this.rate = rate;
    this.nickname = nickname;
  }
}
