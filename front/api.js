// import axios from 'axios';
// import { SignUpDto, User, SignInDto } from './types/user';

// const API_BASE_URL = 'http://localhost:3000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
// });
// //인터셉터
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API error:', error);
//     return Promise.reject(error);
//   },
// );

// export const userApi = {
//   //   getAll: () => api.get<User[]>('/user'),
//   getOne: (id: number) => api.get<User>(`/users${id}`),
//   create: (userData: SignUpDto) => api.post<User>('/users', userData),
// };
// export const authApi = {
//   login: (userData: SignInDto) => api.post('/signIn', userData),
// };
import axios from 'axios';
//import {user...}(user.js)

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error);
    return Promise.reject(error);
  },
);

export const userApi = {
  // getAll: () => api.get('/user'),
  getOne: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
};

export const authApi = {
  login: (userData) => api.post('/signIn', userData),
};
