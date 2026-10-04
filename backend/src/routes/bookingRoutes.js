import { Router } from 'express';
import { createBooking, listBookedSeats, myBookings, allBookings, cancelBooking, cancelMovieBookings } from '../controllers/bookingController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.get('/booked', listBookedSeats);                                     // public (seat map)
router.get('/mine', requireAuth, myBookings);                               // signed-in user
router.get('/', requireAuth, requireAdmin, allBookings);                    // admin
router.post('/', requireAuth, createBooking);                               // signed-in user
router.delete('/movie/:movieId', requireAuth, requireAdmin, cancelMovieBookings); // admin
router.delete('/:id', requireAuth, requireAdmin, cancelBooking);            // admin
export default router;
