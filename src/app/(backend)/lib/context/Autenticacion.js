'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';

const Autenticacion = createContext();

export function AutenticacionUsuario({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/cookie', { method: 'GET' }); // <-- Invoca el endpoint
        const data = await res.json();

        if (data.user) {
          setUser(data.user); // El usuario viene desde el JWT en la cookie
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error obteniendo usuario:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = (token) => {
    const decoded = jwt.decode(token);
    setUser(decoded.user);
    // No guardamos el token en localStorage, ya está en cookie HttpOnly
  };

  const logout = async () => {
    setUser(null);
    await fetch('/api/cookie', { method: 'POST' }); // borra cookie en backend
  };

  return (
    <Autenticacion.Provider value={{ user, loading, login, logout }}>
      {children}
    </Autenticacion.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(Autenticacion);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
