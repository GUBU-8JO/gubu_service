export class PlatformVo {
  id: number;
  title: string;
  price: number;
  rating?: number;
  image?: string;
  categoryId?: number;
  purchaseLink?: string;
  period?: number;

  constructor(
    id: number,
    title: string,
    price: number,
    rating?: number,
    image?: string,
    categoryId?: number,
    purchaseLink?: string,
    period?: number,
  ) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.rating = rating;
    this.image = image;
    this.categoryId = categoryId;
    this.purchaseLink = purchaseLink;
    this.period = period;
  }
}
