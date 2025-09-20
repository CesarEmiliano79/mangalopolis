
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';

const Autenticacion = createContext();

export function AutenticacionAdmin({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/cookieAdmin', { method: 'GET' }); // <-- Invoca el endpoint
        const data = await res.json();

        if (data.admin) {
          setAdmin(data.admin); 
        } else {
          setAdmin(null);
        }
      } catch (error) {
        console.error('Error obteniendo admin:', error);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = (token) => {
    const decoded = jwt.decode(token);
    setAdmin(decoded.user);
    // No guardamos el token en localStorage, ya está en cookie HttpOnly
  };

  const logout = async () => {
    setAdmin(null);
    await fetch('/api/cookieAdmin', { method: 'POST' }); // borra cookie en backend
  };

  return (
    <Autenticacion.Provider value={{ admin, loading, login, logout }}>
      {children}
    </Autenticacion.Provider>
  );
}

export const useAuthAdmin = () => {
  const context = useContext(Autenticacion);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
