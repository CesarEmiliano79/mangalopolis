'use client';

import { useAuth } from '../lib/context/Autenticacion';
import LayoutConSesion from './LayoutConSesion';
import LayoutSinSesion from './LayoutSinSesion';

export default function LayoutPrincipal({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <LayoutConSesion user={user}>
          {children}
        </LayoutConSesion>
      ) : (
        <LayoutSinSesion>
          {children}
        </LayoutSinSesion>
      )}
    </>
  );
}