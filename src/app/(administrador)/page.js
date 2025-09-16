import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Texto principal */}
        <div className="text-center lg:text-left space-y-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-700">
            Mangalopolis
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-700 leading-tight">
            Pagina de Administradores
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/admin/registro">
              <button className="bg-pink-500 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg">
                Inicio
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}