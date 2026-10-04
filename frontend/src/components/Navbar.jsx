import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const close = () => setOpen(false);

  const signOut = () => {
    logout();
    close();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark" aria-hidden="true">🎟</span> MovieBook
        </Link>
        <button className="nav-toggle" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
        <nav className={`nav-links ${open ? 'open' : ''}`} onClick={(e) => e.target.closest('a') && close()}>
          <NavLink to="/movies">Movies</NavLink>
          {user && !isAdmin && <NavLink to="/my-bookings">My bookings</NavLink>}
          {isAdmin && <NavLink to="/admin">Admin panel</NavLink>}
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <div className="nav-auth">
            {user ? (
              <>
                <span className="who">{isAdmin ? 'Admin' : user.name.split(' ')[0]}</span>
                <button className="btn ghost sm" onClick={signOut}>Sign out</button>
              </>
            ) : (
              <>
                <Link className="btn ghost sm" to="/login">Sign in</Link>
                <Link className="btn primary sm" to="/register">Create account</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
