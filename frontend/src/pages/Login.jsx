import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api/client';
import Toast from '../components/Toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setBusy(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : from || '/movies', { replace: true });
    } catch (err) {
      setMsg(errMsg(err, 'Could not sign in. Check that the backend is running.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="form auth-card" onSubmit={onSubmit}>
        <h2>Sign in</h2>
        <p className="muted">Admins and customers sign in here.</p>
        <Toast type="info" message={location.state?.reason} />
        <Toast type="error" message={msg} />
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <button className="btn primary lg block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <p className="muted small center">New here? <Link className="link" to="/register" state={{ from }}>Create an account</Link></p>
      </form>
    </section>
  );
}
