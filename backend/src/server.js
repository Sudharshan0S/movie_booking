import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { corsMiddleware } from './config/cors.js';
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

dotenv.config();

const app = express();

try {
  await connectDB(process.env.MONGO_URI);
} catch (err) {
  console.error('\nCould not connect to MongoDB at', process.env.MONGO_URI);
  console.error('Start MongoDB (or put an Atlas URL in backend/.env) and try again.\n');
  process.exit(1);
}

app.use(morgan('dev'));
app.use(express.json());
app.use(corsMiddleware(process.env.FRONTEND_URL));

// The backend only handles accounts (sign up / sign in) and seat bookings.
// Movies and posters live in the frontend.
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
