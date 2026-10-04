import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem('mb_token')) return setReady(true);
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch {
        localStorage.removeItem('mb_token');
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const save = ({ token, user }) => {
    localStorage.setItem('mb_token', token);
    setUser(user);
    return user;
  };

  const login = async (email, password) => save((await api.post('/auth/login', { email, password })).data);
  const register = async (form) => save((await api.post('/auth/register', form)).data);
  const logout = () => {
    localStorage.removeItem('mb_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, isAdmin: user?.role === 'admin', login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
