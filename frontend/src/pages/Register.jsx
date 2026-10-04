import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api/client';
import Toast from '../components/Toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from;
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!/^\d{10,}$/.test(form.phone.replace(/\D/g, ''))) return setMsg('Phone must have at least 10 digits.');
    if (form.password.length < 6) return setMsg('Password must be at least 6 characters.');
    setBusy(true);
    try {
      await register(form);
      navigate(from || '/movies', { replace: true });
    } catch (err) {
      setMsg(errMsg(err, 'Could not create the account. Check that the backend is running.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="form auth-card" onSubmit={onSubmit}>
        <h2>Create your account</h2>
        <p className="muted">It takes a minute and lets you book seats.</p>
        <Toast type="error" message={msg} />
        <div className="field"><label htmlFor="name">Full name</label><input id="name" autoComplete="name" value={form.name} onChange={set('name')} required /></div>
        <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required /></div>
        <div className="field"><label htmlFor="phone">Phone</label><input id="phone" type="tel" autoComplete="tel" placeholder="At least 10 digits" value={form.phone} onChange={set('phone')} required /></div>
        <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="new-password" placeholder="At least 6 characters" value={form.password} onChange={set('password')} required /></div>
        <button className="btn primary lg block" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
        <p className="muted small center">Already registered? <Link className="link" to="/login" state={{ from }}>Sign in</Link></p>
      </form>
    </section>
  );
}
