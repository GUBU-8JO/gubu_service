import { HttpException } from '@nestjs/common';

export class ResponseDto<T> {
  error: boolean;
  data: T;
  errorMessage: string;
  statusCode: number;

  constructor(data: T, error: boolean = false, exception?: HttpException) {
    this.data = data;
    if (error) {
      this.error = error;
    }
    if (exception) {
      this.errorMessage = exception.message;
      this.statusCode = exception.getStatus();
    }
  }
}
