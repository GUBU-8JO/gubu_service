import { HttpException } from '@nestjs/common';

export class ResponseDto<T> {
  success: boolean;
  data: T;
  errorMessage: string;
  //   statusCode: number;

  constructor(data: T, exception?: HttpException) {
    this.success = !exception;
    this.data = data;
    // if (error) {
    //   this.error = error;
    // }
    if (exception) {
      this.errorMessage = exception.message;
      //   this.statusCode = exception.getStatus();
    }
  }
}
