import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMovies, deleteMovie, resetCatalog, exportCatalog } from '../lib/catalog';
import { getAllBookings, cancelBooking, cancelMovieBookings } from '../api';
import { errMsg } from '../api/client';
import Poster from '../components/Poster';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

export default function AdminDashboard() {
  const [tab, setTab] = useState('bookings');
  const [movies, setMovies] = useState(getMovies);
  const [bookings, setBookings] = useState([]);
  const [bookingsError, setBookingsError] = useState('');
  const [msg, setMsg] = useState({ type: 'info', text: '' });
  const [confirm, setConfirm] = useState(null); // { kind: 'movie' | 'booking', item }
  const [busy, setBusy] = useState(false);

  // Movies are always available (frontend). Bookings need the backend.
  const loadBookings = useCallback(async () => {
    try {
      const { data } = await getAllBookings();
      setBookings(data);
      setBookingsError('');
    } catch (err) {
      setBookingsError(errMsg(err, 'Could not reach the booking server. Start the backend to see bookings.'));
    }
  }, []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const active = bookings.filter((b) => b.status === 'confirmed');
  const revenue = active.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const doConfirm = async () => {
    setBusy(true);
    try {
      if (confirm.kind === 'movie') {
        // Delete from the frontend catalog, then cancel that movie's bookings on the backend
        deleteMovie(confirm.item.id);
        setMovies(getMovies());
        try {
          const { data } = await cancelMovieBookings(confirm.item.id);
          setMsg({ type: 'success', text: `Deleted "${confirm.item.title}". ${data.cancelledBookings} active booking(s) were cancelled.` });
        } catch {
          setMsg({ type: 'info', text: `Deleted "${confirm.item.title}", but the booking server was unreachable, so its bookings were not cancelled. Cancel them from the Bookings tab once the backend is running.` });
        }
      } else {
        await cancelBooking(confirm.item._id);
        setMsg({ type: 'success', text: `Cancelled the booking for ${confirm.item.name}.` });
      }
      await loadBookings();
    } catch (err) {
      setMsg({ type: 'error', text: errMsg(err) });
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  };

  const restoreDefaults = () => {
    resetCatalog();
    setMovies(getMovies());
    setMsg({ type: 'success', text: 'Movie list restored to the catalog in src/data/movies.js.' });
  };

  return (
    <section>
      <div className="section-head">
        <h2>Admin panel</h2>
        <Link to="/admin/add-movie" className="btn primary">Add a movie</Link>
      </div>

      <div className="stats">
        <div><strong>{movies.length}</strong><span>Movies</span></div>
        <div><strong>{bookingsError ? '–' : active.length}</strong><span>Active bookings</span></div>
        <div><strong>{bookingsError ? '–' : `₹${revenue}`}</strong><span>Booked value</span></div>
      </div>

      <Toast type={msg.type} message={msg.text} />

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'bookings'} className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')}>Bookings</button>
        <button role="tab" aria-selected={tab === 'movies'} className={tab === 'movies' ? 'active' : ''} onClick={() => setTab('movies')}>Movies</button>
      </div>

      {tab === 'bookings' && (
        bookingsError ? <Toast type="error" message={bookingsError} /> :
        bookings.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Customer</th><th>Movie</th><th>Show</th><th>Seats</th><th>Total</th><th>Status</th><th /></tr></thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className={b.status === 'cancelled' ? 'dim' : ''}>
                    <td><strong>{b.name}</strong><br /><span className="muted small">{b.email}</span></td>
                    <td>{b.movieTitle}</td>
                    <td>{b.showtime}</td>
                    <td>{b.seats.join(', ')}</td>
                    <td>₹{b.totalPrice}</td>
                    <td><span className={`badge ${b.status}`}>{b.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}</span></td>
                    <td>{b.status === 'confirmed' && <button className="btn danger sm" onClick={() => setConfirm({ kind: 'booking', item: b })}>Cancel booking</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="muted empty">No bookings yet. They will show up here as customers book.</p>
      )}

      {tab === 'movies' && (
        <>
          <div className="admin-tools">
            <p className="muted small">Movie changes are saved in this browser. Use Export to copy them into <code>src/data/movies.js</code> for everyone.</p>
            <div>
              <button className="btn ghost sm" onClick={exportCatalog}>Export catalog</button>
              <button className="btn ghost sm" onClick={restoreDefaults}>Restore defaults</button>
            </div>
          </div>
          {movies.length ? (
            <div className="admin-movies">
              {movies.map((m) => (
                <div key={m.id} className="admin-movie">
                  <Poster src={m.posterUrl} alt="" className="admin-thumb" />
                  <div>
                    <strong>{m.title}</strong>
                    <p className="muted small">{m.genre} · {m.language} · {m.durationMins} min · ₹{m.price}</p>
                    <p className="muted small">{m.showtimes.join(' | ')}</p>
                  </div>
                  <button className="btn danger sm" onClick={() => setConfirm({ kind: 'movie', item: m })}>Delete</button>
                </div>
              ))}
            </div>
          ) : <p className="muted empty">No movies in the list. Add one, or restore the defaults.</p>}
        </>
      )}

      <ConfirmDialog
        open={!!confirm}
        busy={busy}
        title={confirm?.kind === 'movie' ? `Delete "${confirm?.item.title}"?` : 'Cancel this booking?'}
        body={confirm?.kind === 'movie'
          ? 'The movie disappears from the site and all of its active bookings are cancelled.'
          : confirm ? `${confirm.item.name}'s seats (${confirm.item.seats.join(', ')}) will be released for other customers.` : ''}
        confirmLabel={confirm?.kind === 'movie' ? 'Delete movie' : 'Cancel booking'}
        onConfirm={doConfirm}
        onCancel={() => !busy && setConfirm(null)}
      />
    </section>
  );
}
