export interface User {
  email: string;
  nickname: string;
  password: string;
  rePassword: string;
}

export interface SignUpDto {
  email: string;
  nickname: string;
  password: string;
}

export interface SignInDto {
  email: string;
  password: string;
}
// 할일1. js로 바꿔줘 라고 물어보기
// dto 해결 ; js로 바꾸기