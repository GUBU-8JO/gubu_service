import { CreateReviewVo } from './create-review-vo.dto';

export class ReadReviewVo extends CreateReviewVo {
  id: number;
  constructor(rate: number, comment: string, id: number) {
    super(rate, comment);
    this.id = id;
  }
}
