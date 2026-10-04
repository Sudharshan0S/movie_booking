import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import { isNonEmpty } from '../utils/validators.js';

const SEAT_RE = /^[A-J](?:[1-9]|1[0-2])$/;
const TAKEN = 'Some of those seats were just taken. Pick different seats.';
const cleanId = (v) => (typeof v === 'string' && v.length > 0 && v.length <= 100 ? v : null);

// Public: the seat map must show what is taken without logging in
export const listBookedSeats = async (req, res) => {
  const movieId = cleanId(req.query.movieId);
  const { showtime } = req.query;
  if (!movieId || !isNonEmpty(showtime)) return res.status(400).json({ message: 'movieId and showtime required' });
  const bookings = await Booking.find({ movieId, showtime, status: 'confirmed' });
  res.json({ booked: bookings.flatMap((b) => b.seats) });
};

// Signed-in users only. Movie details are sent by the frontend catalog.
export const createBooking = async (req, res) => {
  if (req.user.role === 'admin') return res.status(403).json({ message: 'Admins cannot book seats. Sign in as a user.' });

  const { movieId, movieTitle, showtime, seats, pricePerSeat } = req.body;
  if (!cleanId(movieId) || !isNonEmpty(movieTitle) || !isNonEmpty(showtime)) {
    return res.status(400).json({ message: 'Movie and showtime are required' });
  }
  if (!Array.isArray(seats) || seats.length === 0) return res.status(400).json({ message: 'Choose at least one seat' });
  const uniqueSeats = [...new Set(seats)];
  if (uniqueSeats.length > 10 || !uniqueSeats.every((s) => SEAT_RE.test(s))) {
    return res.status(400).json({ message: 'Invalid seat selection (maximum 10 seats)' });
  }
  const price = Number(pricePerSeat);
  if (!(price > 0 && price <= 10000)) return res.status(400).json({ message: 'Invalid seat price' });

  const taken = await Booking.find({ movieId, showtime, status: 'confirmed', seats: { $in: uniqueSeats } });
  if (taken.length) return res.status(409).json({ message: TAKEN });

  try {
    const booking = await Booking.create({
      userId: req.user._id,
      movieId,
      movieTitle: movieTitle.trim().slice(0, 200),
      showtime,
      seats: uniqueSeats,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone || '0000000000',
      totalPrice: uniqueSeats.length * price
    });
    res.status(201).json(booking);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: TAKEN });
    throw err;
  }
};

export const myBookings = async (req, res) => {
  if (req.user.role === 'admin') return res.json([]);
  res.json(await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 }));
};

// Admin: every booking from every user
export const allBookings = async (_req, res) => {
  res.json(await Booking.find().sort({ createdAt: -1 }));
};

// Admin only: cancel one booking
export const cancelBooking = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid booking id' });
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (booking.status === 'cancelled') return res.status(400).json({ message: 'Booking is already cancelled' });
  booking.status = 'cancelled';
  booking.cancelledBy = 'admin';
  await booking.save();
  res.json(booking);
};

// Admin only: cancel every active booking for a movie (used when the admin deletes that movie)
export const cancelMovieBookings = async (req, res) => {
  const movieId = cleanId(req.params.movieId);
  if (!movieId) return res.status(400).json({ message: 'Invalid movie id' });
  const result = await Booking.updateMany({ movieId, status: 'confirmed' }, { status: 'cancelled', cancelledBy: 'admin' });
  res.json({ cancelledBookings: result.modifiedCount });
};
