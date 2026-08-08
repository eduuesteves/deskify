import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000, // Cancela a requisição se demorar mais de 10s
});