import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken, signAdminToken, adminEmail, adminUser } from '../middleware/auth.js';
import { isValidEmail, isValidPhoneMin10, isNonEmpty } from '../utils/validators.js';

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role });

export const register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!isNonEmpty(name)) return res.status(400).json({ message: 'Name is required' });
  if (!isValidEmail(email)) return res.status(400).json({ message: 'Enter a valid email address' });
  if (!isValidPhoneMin10(phone)) return res.status(400).json({ message: 'Phone must have at least 10 digits' });
  if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

  const normalized = email.toLowerCase().trim();
  if (normalized === adminEmail() || (await User.findOne({ email: normalized }))) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }
  // Public sign-up can only ever create normal users
  const user = await User.create({
    name: name.trim(),
    email: normalized,
    phone: String(phone).trim(),
    password: await bcrypt.hash(password, 10),
    role: 'user'
  });
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!isValidEmail(email) || !password) return res.status(400).json({ message: 'Enter your email and password' });
  const normalized = email.toLowerCase().trim();

  // Admin: checked against .env, never stored in the database
  if (normalized === adminEmail()) {
    const expected = process.env.ADMIN_PASSWORD || 'admin123';
    if (password !== expected) return res.status(401).json({ message: 'Incorrect email or password' });
    return res.json({ token: signAdminToken(), user: publicUser(adminUser()) });
  }

  const user = await User.findOne({ email: normalized });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }
  res.json({ token: signToken(user), user: publicUser(user) });
};

export const me = (req, res) => res.json({ user: publicUser(req.user) });
