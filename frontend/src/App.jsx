import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RequireRole from './components/RequireRole';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import AddMovie from './pages/AddMovie';
import { About, Contact, FAQ, NotFound } from './pages/Info';

const OldBookLink = () => <Navigate to={`/movies/${useParams().id}`} replace />;

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          {/* Public: anyone can browse and look at seats */}
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/book/:id" element={<OldBookLink />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Signed-in users */}
          <Route path="/my-bookings" element={<RequireRole role="user"><MyBookings /></RequireRole>} />

          {/* Admin only */}
          <Route path="/admin" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
          <Route path="/admin/add-movie" element={<RequireRole role="admin"><AddMovie /></RequireRole>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
