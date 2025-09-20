
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthAdmin } from '../lib/contextAdmin/AutenticacionAdmin';
import LayoutSinSesion from './LayoutSinSesion';

export const metadata = {
  title: 'Mangalopolis',
  description: 'Pagina de Administrador',
};

export default function LayoutAdmin({ children}) {
    const {admin, logout, loading} = useAuthAdmin();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
      if (!confirm('¿Estás seguro de que quieres cerrar sesión?')) return;
      setIsLoggingOut(true);
      await logout();   // ahora sí funciona
      router.push('/');
    };

    if(loading){
      return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Cargando...</p>
        </div>
      </div>
    );
    }

  return (
    <div className="min-h-screen bg-gray-100">
      
      <>
        {admin ? (
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">Mangalopolis</h1>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Hola, {admin?.nombre || admin?.name}</span>
                  <a href="/nueAdmin" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                    Crear Admin
                  </a>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? 'Saliendo...' : 'Cerrar sesión'}
                  </button>
                </div>
              </div>
            </div>
          </header>
        ) : (
          <LayoutSinSesion>
            {children}
          </LayoutSinSesion>
        )}
      </>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
