import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getMovie } from '../lib/catalog';
import { getBookedSeats, createBooking } from '../api';
import { errMsg } from '../api/client';
import { useAuth } from '../context/AuthContext';
import SeatGrid from '../components/SeatGrid';
import Poster from '../components/Poster';
import Toast from '../components/Toast';

const MAX_SEATS = 10;

export default function MovieDetail() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pendingKey = `mb_pending_${id}`;

  const [movie] = useState(() => getMovie(id));
  const [showtime, setShowtime] = useState('');
  const [booked, setBooked] = useState([]);
  const [offline, setOffline] = useState(false);
  const [selected, setSelected] = useState([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  // Pick the first show, or restore a seat choice made before signing in
  useEffect(() => {
    if (!movie) return;
    let pending = null;
    try { pending = JSON.parse(sessionStorage.getItem(pendingKey)); } catch { /* ignore */ }
    if (pending && movie.showtimes.includes(pending.showtime)) {
      setShowtime(pending.showtime);
      setSelected(pending.seats || []);
      sessionStorage.removeItem(pendingKey);
    } else {
      setShowtime(movie.showtimes[0] || '');
    }
  }, [movie, pendingKey]);

  // Taken seats come from the backend. If it is off, the page still works, but booking cannot.
  const loadBooked = useCallback(async () => {
    if (!showtime) return [];
    try {
      const { data } = await getBookedSeats(id, showtime);
      setBooked(data.booked);
      setOffline(false);
      return data.booked;
    } catch {
      setBooked([]);
      setOffline(true);
      return [];
    }
  }, [id, showtime]);

  useEffect(() => { loadBooked(); }, [loadBooked]);

  const pickShowtime = (t) => {
    setShowtime(t);
    setSelected([]);
    setMsg('');
  };

  const toggleSeat = (s) => {
    setMsg('');
    setSelected((prev) => {
      if (prev.includes(s)) return prev.filter((x) => x !== s);
      if (prev.length >= MAX_SEATS) { setMsg(`You can book up to ${MAX_SEATS} seats at a time.`); return prev; }
      return [...prev, s];
    });
  };

  const book = async () => {
    if (!selected.length) return setMsg('Choose at least one seat first.');
    if (!user) {
      sessionStorage.setItem(pendingKey, JSON.stringify({ showtime, seats: selected }));
      return navigate('/login', { state: { from: location.pathname, reason: 'Sign in to book your seats. Your selection will be waiting.' } });
    }
    setBusy(true);
    setMsg('');
    try {
      await createBooking({ movieId: movie.id, movieTitle: movie.title, showtime, seats: selected, pricePerSeat: movie.price });
      navigate('/my-bookings', { state: { justBooked: true } });
    } catch (err) {
      setMsg(errMsg(err, 'Could not reach the booking server. Make sure the backend is running.'));
      const nowBooked = await loadBooked();
      setSelected((prev) => prev.filter((s) => !nowBooked.includes(s)));
    } finally {
      setBusy(false);
    }
  };

  if (!movie) return <section className="prose"><h2>Movie not found</h2><p className="muted">It may have been removed from the schedule.</p></section>;

  const total = selected.length * movie.price;

  return (
    <section className="detail">
      <div className="detail-top">
        <Poster className="detail-poster" src={movie.posterUrl} alt={`${movie.title} poster`} />
        <div className="detail-info">
          <h1>{movie.title}</h1>
          <p className="meta">{movie.genre} · {movie.language} · {movie.durationMins} min</p>
          <p className="desc">{movie.description || 'No description yet.'}</p>
          <h4>Showtime</h4>
          <div className="chips">
            {movie.showtimes.map((t) => (
              <button key={t} className={`chip ${t === showtime ? 'active' : ''}`} onClick={() => pickShowtime(t)}>{t}</button>
            ))}
          </div>
          <p className="muted price-line">₹{movie.price} per seat</p>
        </div>
      </div>

      {offline && <Toast type="info" message="The booking server is not reachable right now, so taken seats cannot be shown and booking is unavailable. Start the backend and refresh." />}

      <div className="booking-layout">
        <div className="seats-panel">
          <SeatGrid bookedSeats={booked} selectedSeats={selected} onToggle={toggleSeat} />
        </div>

        <aside className="ticket">
          <h3>Your tickets</h3>
          <dl>
            <div><dt>Movie</dt><dd>{movie.title}</dd></div>
            <div><dt>Show</dt><dd>{showtime}</dd></div>
            <div><dt>Seats</dt><dd>{selected.length ? [...selected].sort().join(', ') : 'None chosen yet'}</dd></div>
          </dl>
          <div className="ticket-tear" aria-hidden="true" />
          <div className="ticket-total"><span>Total</span><strong>₹{total}</strong></div>
          <Toast type="error" message={msg} />
          {isAdmin ? (
            <p className="muted small">You are signed in as admin. Admins manage movies and bookings from the Admin panel.</p>
          ) : (
            <button className="btn primary lg block" onClick={book} disabled={busy}>
              {busy ? 'Booking…' : user ? `Book ${selected.length || ''} seat${selected.length === 1 ? '' : 's'}`.replace('  ', ' ') : 'Sign in to book'}
            </button>
          )}
          {!user && <p className="muted small">You can look around freely. We only ask you to sign in when you book.</p>}
        </aside>
      </div>
    </section>
  );
}
