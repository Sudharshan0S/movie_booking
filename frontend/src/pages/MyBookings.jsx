import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getMyBookings } from '../api';
import { getMovie } from '../lib/catalog';
import Poster from '../components/Poster';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const justBooked = useLocation().state?.justBooked;

  useEffect(() => {
    getMyBookings()
      .then(({ data }) => setBookings(data))
      .catch(() => setMsg('Could not load your bookings. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  return (
    <section>
      <h2>My bookings</h2>
      <Toast type="success" message={justBooked ? 'Booking confirmed. Show this ticket at the counter.' : ''} />
      <Toast type="error" message={msg} />
      {!bookings.length && !msg && (
        <div className="empty-card">
          <p>You have not booked anything yet.</p>
          <Link className="btn primary" to="/movies">Find a movie</Link>
        </div>
      )}
      <div className="stub-list">
        {bookings.map((b) => (
          <article key={b._id} className={`stub ${b.status}`}>
            <Poster className="stub-poster" src={getMovie(b.movieId)?.posterUrl} alt="" />
            <div className="stub-main">
              <h3>{b.movieTitle}</h3>
              <p className="meta">{b.showtime}</p>
              <p><strong>Seats:</strong> {b.seats.join(', ')}</p>
              <p className="muted small">Booked on {new Date(b.createdAt).toLocaleString()}</p>
            </div>
            <div className="stub-side">
              <span className={`badge ${b.status}`}>{b.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}</span>
              <strong className="stub-price">₹{b.totalPrice}</strong>
              {b.status === 'cancelled' && <small className="muted">Cancelled by {b.cancelledBy === 'admin' ? 'the theatre' : 'you'}</small>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
