import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Texto principal */}
        <div className="text-center lg:text-left space-y-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black">
            Mangalopolis
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-700 leading-tight">
            Tienes una idea, 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> exprésala </span>
            con todos
          </h2>
          
          <p className="text-xl text-gray-700 max-w-2xl mx-auto lg:mx-0">
            Comparte ideas, encuentra puntos de vista diferente y talvez encuentres tu proxima historia favorita
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/registro">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                Comenzar ahora
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}