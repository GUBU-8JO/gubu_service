import { CreateReviewVo } from './create-review-vo';

export class ReadReviewVo extends CreateReviewVo {
  id: number;
  nickname: string;

  constructor(id: number, rate: number, comment: string, nickname: string) {
    super(id, rate, comment);
    this.id = id;
    this.nickname = nickname;
  }
}
