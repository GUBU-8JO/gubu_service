export class PlatformVo {
  id: number;
  title: string;
  price: number;
  image?: string;
  purchaseLink?: string;
  period?: number;
  rating?: number;

  constructor(
    id: number,
    title: string,
    price: number,
    image?: string,
    purchaseLink?: string,
    period?: number,
    rating?: number,
  ) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.image = image;
    this.purchaseLink = purchaseLink;
    this.period = period;
    this.rating = rating;
  }
}
