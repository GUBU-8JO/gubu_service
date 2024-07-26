export class PlatformVo {
    id: number
    title: string
    price: string
    comment?: string

    constructor(id: number, title: string, price: number, comment? : string) {
        this.id = id
        this.title = title
        this.price = price + "원"
        this.comment = comment
    }
}