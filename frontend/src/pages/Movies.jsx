import React, { useMemo, useState } from 'react';
import { getMovies } from '../lib/catalog';
import MovieCard from '../components/MovieCard';

export default function Movies() {
  const [movies] = useState(getMovies);
  const [q, setQ] = useState('');

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? movies.filter((m) => `${m.title} ${m.genre} ${m.language}`.toLowerCase().includes(t)) : movies;
  }, [movies, q]);

  return (
    <section>
      <div className="section-head">
        <h2>Now showing</h2>
        <input className="search" type="search" placeholder="Search title, genre or language" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search movies" />
      </div>
      <div className="grid movies-grid">
        {shown.map((m) => <MovieCard key={m.id} movie={m} />)}
      </div>
      {!shown.length && <p className="muted empty">{q ? `No movies match "${q}".` : 'No movies are showing right now. Check back soon.'}</p>}
    </section>
  );
}
