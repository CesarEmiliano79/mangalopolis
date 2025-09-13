'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const Autenticacion = createContext();

export function AutenticacionUsuario({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar localStorage al cargar
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Autenticacion.Provider value={{ user, loading, login, logout }}>
      {children}
    </Autenticacion.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(Autenticacion);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};