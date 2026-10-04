import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

// role = "user" (any signed-in account) or "admin"
export default function RequireRole({ role = 'user', children }) {
  const { user, ready, isAdmin } = useAuth();
  const location = useLocation();
  if (!ready) return <Loader />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname, reason: 'Sign in to continue' }} replace />;
  if (role === 'admin' && !isAdmin) return <Navigate to="/" replace />;
  return children;
}
