import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <strong className="brand">🎟 MovieBook</strong>
        <nav>
          <Link to="/movies">Movies</Link>
          <Link to="/about">About</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <small>© {new Date().getFullYear()} MovieBook. Book seats, skip the queue.</small>
      </div>
    </footer>
  );
}
