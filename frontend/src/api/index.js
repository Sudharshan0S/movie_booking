import api from './client';

// The backend only knows about accounts (see AuthContext) and bookings.
export const getBookedSeats = (movieId, showtime) => api.get('/bookings/booked', { params: { movieId, showtime } });
export const createBooking = (payload) => api.post('/bookings', payload);
export const getMyBookings = () => api.get('/bookings/mine');
export const getAllBookings = () => api.get('/bookings');
export const cancelBooking = (id) => api.delete(`/bookings/${id}`);
export const cancelMovieBookings = (movieId) => api.delete(`/bookings/movie/${encodeURIComponent(movieId)}`);
