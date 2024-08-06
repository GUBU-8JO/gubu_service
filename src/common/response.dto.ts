import { HttpException } from '@nestjs/common';

export class ResponseDto<T = void> {
  success: boolean;
  data?: T;
  message?: string;
  errorMessage: string;
  //   statusCode: number;

  constructor(data?: T, exception?: HttpException, message?: string) {
    this.success = !exception;
    if (data) {
      this.data = data;
    }
    if (exception) {
      this.errorMessage = exception.message;
      //   this.statusCode = exception.getStatus();
    }

    if (message) {
      this.message = message;
    }
  }
}
