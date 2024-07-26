export class ResponseDto<T> {
  errorMessage?: string
  data: T

  constructor(data: T = null, errorMessage?: string) {
    this.data = data
    this.errorMessage = errorMessage
  }
}