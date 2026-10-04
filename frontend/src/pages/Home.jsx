import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getMovies } from '../lib/catalog';
import MovieCard from '../components/MovieCard';
import Poster from '../components/Poster';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [movies] = useState(getMovies);
  const { user } = useAuth();
  const fan = movies.slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <h1>Pick a film.<br />Pick your seat.</h1>
          <p>Browse what is playing, look at the seat map for any show, and book in a minute. Create a free account when you are ready to reserve.</p>
          <div className="hero-actions">
            <Link to="/movies" className="btn primary lg">See what is playing</Link>
            {!user && <Link to="/register" className="btn ghost lg">Create account</Link>}
          </div>
        </div>
        <div className="hero-fan" aria-hidden="true">
          {fan.map((m, i) => (
            <Poster key={m.id} src={m.posterUrl} alt="" className={`fan fan-${i}`} />
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Now showing</h2>
          <Link to="/movies" className="link">All movies</Link>
        </div>
        <div className="grid movies-grid">
          {movies.slice(0, 8).map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
      </section>

      <section className="steps">
        <div><h3>Browse freely</h3><p>No account needed to see titles, posters, showtimes and open seats.</p></div>
        <div><h3>Choose your seats</h3><p>Tap seats on the map. Taken seats are greyed out so you never double book.</p></div>
        <div><h3>Sign in to confirm</h3><p>Sign in or create an account and your booking is saved under My bookings.</p></div>
      </section>
    </>
  );
}
