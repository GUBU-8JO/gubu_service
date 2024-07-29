export class CreateReviewVo {
  rate: number;
  comment: string;
  constructor(rate: number, comment: string) {
    this.rate = rate;
    this.comment = comment;
  }
}
