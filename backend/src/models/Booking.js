import mongoose from 'mongoose';

// movieId / movieTitle come from the frontend catalog, so the backend stores them as plain text.
const BookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: String, required: true },
    movieTitle: { type: String, required: true },
    showtime: { type: String, required: true },
    seats: [{ type: String, required: true }],
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    totalPrice: { type: Number, default: 0 },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
    cancelledBy: { type: String, enum: ['', 'admin', 'user'], default: '' }
  },
  { timestamps: true }
);

// Cancelled bookings free their seats, so only confirmed ones are indexed.
// A multikey unique index stops two people from ever holding the same seat.
BookingSchema.index(
  { movieId: 1, showtime: 1, seats: 1 },
  { unique: true, partialFilterExpression: { status: 'confirmed' } }
);

export default mongoose.model('Booking', BookingSchema);
