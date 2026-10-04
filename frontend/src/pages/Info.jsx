import React from 'react';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <section className="prose">
      <h2>About MovieBook</h2>
      <p>MovieBook is a movie ticket booking app built with the MERN stack: MongoDB, Express, React and Node.</p>
      <p>Anyone can browse movies and see which seats are free. A free account is needed to book, and admins manage the movie list and bookings.</p>
    </section>
  );
}

export function Contact() {
  return (
    <section className="prose">
      <h2>Contact</h2>
      <p>Need help with a booking? Write to <a className="link" href="mailto:support@example.com">support@example.com</a> and include the movie, show time and your seats.</p>
    </section>
  );
}

const faqs = [
  ['Do I need an account to look around?', 'No. Movies, posters, showtimes and the seat map are open to everyone. You only sign in to confirm a booking.'],
  ['What happens to my seat choice when I sign in?', 'It is kept for you. After signing in you return to the same movie with your seats still selected.'],
  ['Can two people book the same seat?', 'No. Taken seats are greyed out and the server rejects a seat that was booked a moment earlier by someone else.'],
  ['How do I cancel a booking?', 'Cancellations are handled by the theatre admin. Contact support with your booking details.'],
  ['How many seats can I book at once?', 'Up to 10 seats per booking.']
];

export function FAQ() {
  return (
    <section className="prose">
      <h2>Frequently asked questions</h2>
      {faqs.map(([q, a]) => (
        <details key={q}><summary>{q}</summary><p>{a}</p></details>
      ))}
    </section>
  );
}

export function NotFound() {
  return (
    <section className="prose">
      <h2>This page is not on the schedule</h2>
      <p className="muted">The link may be old or mistyped.</p>
      <Link className="btn primary" to="/movies">Back to movies</Link>
    </section>
  );
}
