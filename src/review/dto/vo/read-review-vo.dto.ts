import { CreateReviewVo } from './create-review-vo.dto';

export class ReadReviewVo extends CreateReviewVo {
  id: number;
  nickname: string;

  constructor(id: number, rate: number, comment: string, nickname: string) {
    super(rate, comment);
    this.id = id;
    this.nickname = nickname;
  }
}
