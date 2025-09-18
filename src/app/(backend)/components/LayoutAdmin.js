'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const metadata = {
  title: 'Mangalopolis',
  description: 'Pagina de Administrador',
};

export default function LayoutAdmin({ children }) {

    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = () => {
        if (!confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        return;
        }
        setIsLoggingOut(true);
        // Redirigir y recargar
        router.push('/');
    };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header con navegación para usuarios logueados */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Mangalopolis</h1>
            </div>
            
            <div className="flex items-center space-x-4">
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
