'use client';
import { useState, useEffect } from "react";

export default function ListaRe({ reviews, onDeleteReview }) {
  const [query, setQuery] = useState("");
  const [reviewsData, setReviewsData] = useState(reviews?.data || []);
  const isLoading = !reviews;

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-500 text-lg">Cargando reviews...</p>
      </div>
    );
  }

  if (!reviewsData || reviewsData.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          ></path>
        </div>
        <p className="text-gray-500 text-lg">No hay reviews disponibles.</p>
        <p className="text-gray-400 mt-2">Sé el primero en compartir tu opinión.</p>
      </div>
    );
  }

  // Usar reviewsData en lugar de reviews.data
  const filteredReviews = reviewsData.filter((review) => {
    const { titulo, opinion, nombre, categorias, calificacion } = review;
    const texto = `${titulo} ${opinion} ${nombre} ${categorias?.join(" ")} ${calificacion}`.toLowerCase();
    return texto.includes(query.toLowerCase());
  });
  
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este item?')) {
      try {
        const response = await fetch('/api/registroAdmin', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
          // Filtrar y actualizar lista local
          setReviewsData((prev) => prev.filter((review) => review._id !== id));
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Opiniones de la Comunidad
        </h2>

        {/* Barra de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por título, opinión, nombre o categoría..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <li
                key={review._id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {review.nombre
                            ? review.nombre.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {review.titulo}
                        </h3>

                        {review.nombre && (
                          <p className="text-sm text-gray-600 mt-1">
                            Por <span className="font-medium">{review.nombre}</span>
                          </p>
                        )}

                        {review.opinion && (
                          <p className="mt-2 text-gray-700 leading-relaxed line-clamp-2">
                            {review.opinion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                      {new Date(review.publicado).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    
                    <button
                        onClick={() => handleDelete(review._id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
                    >
                        Eliminar
                    </button>

                    {/* Sistema de rating */}
                    {review.calificacion && (
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.calificacion
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Categorías o etiquetas */}
                {review.categorias && review.categorias.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {review.categorias.map((categoria, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {categoria}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-2 flex items-center text-xs text-gray-400">
                  <span>Creado: {new Date(review.publicado).toLocaleDateString()}</span>
                </div>
              </li>
            ))
          ) : (
            <li className="px-6 py-8 text-center text-gray-500">
              {`No se encontraron resultados para "${query}"`}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
