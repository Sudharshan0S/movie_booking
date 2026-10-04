import React from 'react';
import { Link } from 'react-router-dom';
import Poster from './Poster';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.id}`} className="movie-card">
      <div className="poster-wrap">
        <Poster src={movie.posterUrl} alt={`${movie.title} poster`} className="movie-poster" />
        <span className="poster-cta">Choose seats</span>
      </div>
      <div className="movie-info">
        <h3 className="title">{movie.title}</h3>
        <p className="meta">{movie.genre} · {movie.language}</p>
        <p className="meta">{movie.durationMins} min · from ₹{movie.price}</p>
      </div>
    </Link>
  );
}
