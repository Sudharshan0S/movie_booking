import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addMovie } from '../lib/catalog';
import { posterFromFile } from '../lib/image';
import Toast from '../components/Toast';

const empty = { title: '', description: '', genre: '', language: 'Telugu', durationMins: 120, price: 150, showtimes: '10:00 AM, 01:30 PM, 06:00 PM, 09:30 PM' };

export default function AddMovie() {
  const [form, setForm] = useState(empty);
  const [poster, setPoster] = useState(''); // small data URL made in the browser
  const [msg, setMsg] = useState({ type: 'info', text: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMsg({ type: 'info', text: '' });
    try {
      setPoster(await posterFromFile(file));
    } catch (err) {
      setPoster('');
      setMsg({ type: 'error', text: err.message });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setMsg({ type: 'info', text: '' });
    const times = form.showtimes.split(',').map((s) => s.trim()).filter(Boolean);
    if (!form.title.trim()) return setMsg({ type: 'error', text: 'Title is required.' });
    if (!poster) return setMsg({ type: 'error', text: 'Choose a poster image first.' });
    if (!times.length) return setMsg({ type: 'error', text: 'Add at least one showtime.' });
    setBusy(true);
    try {
      addMovie({
        title: form.title.trim(),
        description: form.description.trim(),
        genre: form.genre.trim() || 'Drama',
        language: form.language.trim() || 'Telugu',
        durationMins: Number(form.durationMins) || 120,
        price: Number(form.price) || 150,
        showtimes: times,
        posterUrl: poster
      });
      setMsg({ type: 'success', text: `"${form.title}" is now on the movie list.` });
      setForm(empty);
      setPoster('');
      e.target.reset();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="form-page">
      <div className="section-head">
        <h2>Add a movie</h2>
        <Link to="/admin" className="link">Back to admin panel</Link>
      </div>
      <form className="form add-form" onSubmit={onSubmit}>
        <div className="add-poster">
          <div className="poster-drop">
            {poster ? <img src={poster} alt="Poster preview" /> : <span>Poster preview</span>}
          </div>
          <label className="btn ghost block">
            {poster ? 'Change poster' : 'Choose poster'}
            <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={onFile} />
          </label>
          <p className="muted small">JPG, PNG or WEBP. It is resized in your browser. Portrait images look best.</p>
        </div>
        <div className="add-fields">
          <Toast type={msg.type} message={msg.text} />
          <div className="field"><label>Title</label><input value={form.title} onChange={set('title')} required /></div>
          <div className="field"><label>Description</label><textarea rows={3} value={form.description} onChange={set('description')} /></div>
          <div className="row">
            <div className="field"><label>Genre</label><input value={form.genre} onChange={set('genre')} placeholder="Action, Drama…" /></div>
            <div className="field"><label>Language</label><input value={form.language} onChange={set('language')} /></div>
          </div>
          <div className="row">
            <div className="field"><label>Duration (minutes)</label><input type="number" min={30} value={form.durationMins} onChange={set('durationMins')} required /></div>
            <div className="field"><label>Price per seat (₹)</label><input type="number" min={1} value={form.price} onChange={set('price')} required /></div>
          </div>
          <div className="field"><label>Showtimes</label><input value={form.showtimes} onChange={set('showtimes')} required /><p className="muted small">Separate with commas, e.g. 10:00 AM, 01:30 PM</p></div>
          <button className="btn primary lg" disabled={busy}>{busy ? 'Adding…' : 'Add movie'}</button>
        </div>
      </form>
    </section>
  );
}
