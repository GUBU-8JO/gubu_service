export class CreateReviewVo {
  id: number;
  rate: number;
  comment: string;
  constructor(id: number, rate: number, comment: string) {
    this.id = id;
    this.rate = rate;
    this.comment = comment;
  }
}
