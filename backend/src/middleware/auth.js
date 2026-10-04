import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const adminEmail = () => (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();

export const signToken = (user) =>
  jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });

// The admin is not stored in the database. Credentials come from backend/.env.
export const signAdminToken = () =>
  jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });

export const adminUser = () => ({ _id: 'admin', name: 'Admin', email: adminEmail(), phone: '', role: 'admin' });

// Requires a valid login token
export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Please sign in to continue' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role === 'admin') {
      req.user = adminUser();
      return next();
    }
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Account no longer exists' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Session expired, please sign in again' });
  }
};

// Must be used after requireAuth
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access only' });
  next();
};
