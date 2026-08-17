import 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Ou string pura, dependendo do seu ID
    }
  }
}