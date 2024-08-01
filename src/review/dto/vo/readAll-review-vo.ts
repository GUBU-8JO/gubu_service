import { CreateReviewVo } from './create-review-vo';

export class ReadAllReviewVo extends CreateReviewVo {
  platformId: number;
  comment: string;
  nickname: string;
  rate: number;
  constructor(
    rate: number,
    nickname: string,
    comment: string,
    platformId: number,
  ) {
    super(platformId, rate, comment);
    this.rate = rate;
    this.nickname = nickname;
    this.comment = comment;
    this.platformId = platformId;
  }
}
