import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000, // Cancela a requisição se demorar mais de 10s
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@deskify:token');

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});