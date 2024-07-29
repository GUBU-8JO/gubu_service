import { CreateReviewVo } from './create-reivew-vo.dto';

export class ReadAllReviewVo extends CreateReviewVo {
  platformId: number;
  constructor(rate: number, comment: string, platformId: number) {
    super(rate, comment);
    this.platformId = platformId;
  }
}
