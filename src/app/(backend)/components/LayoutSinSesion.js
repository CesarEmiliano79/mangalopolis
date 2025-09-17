
export const metadata = {
  title: 'Mangalopolis',
  description: 'Listado de Reviews',
};

export default function LayoutSinSesion({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header simple para usuarios no logueados */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Mangalopolis</h1>
            <nav className="flex space-x-4">
              <a href="/registro" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">
                Iniciar sesión
              </a>
              <a href="/nuevousuario" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                Registrarse
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {children}
      </main>
    </div>
  );
}