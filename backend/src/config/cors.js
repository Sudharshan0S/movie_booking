import cors from 'cors';

export const corsMiddleware = (origin) =>
  cors({
    origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
