'use client';

import { useState } from 'react';

export default function CrearReview({ onAddItem }) {
  const [formData, setFormData] = useState({
    titulo: '',
    opinion: '',
    nombre: 'Anónimo',
    calificacion: 5,
    categorias: []
  });
  const [categoriaTemporal, setCategoriaTemporal] = useState('');
  const [errors, setErrors] = useState({});

  // Categorías disponibles para seleccionar
  const categoriasDisponibles = [
    'shonen', 'seinen', 'shoujo', 'josei', 'spokon', 
    'mecha', 'isekai', 'fantasia', 'romance', 'comedia',
    'drama', 'aventura', 'ciencia ficcion', 'horror', 'deportes'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCategoriaChange = (categoria) => {
    setFormData(prev => {
      const categorias = prev.categorias.includes(categoria)
        ? prev.categorias.filter(cat => cat !== categoria)
        : [...prev.categorias, categoria];
      
      return { ...prev, categorias };
    });
  };

  const agregarCategoriaManual = () => {
    if (categoriaTemporal.trim() && !formData.categorias.includes(categoriaTemporal.trim())) {
      setFormData(prev => ({
        ...prev,
        categorias: [...prev.categorias, categoriaTemporal.trim()]
      }));
      setCategoriaTemporal('');
    }
  };

  const quitarCategoria = (categoria) => {
    setFormData(prev => ({
      ...prev,
      categorias: prev.categorias.filter(cat => cat !== categoria)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título de la obra es requerido';
    }

    if (!formData.opinion.trim()) {
      newErrors.opinion = 'Tu opinión es requerida';
    } else if (formData.opinion.length < 10) {
      newErrors.opinion = 'La opinión debe tener al menos 10 caracteres';
    }

    if (formData.calificacion < 1 || formData.calificacion > 5) {
      newErrors.calificacion = 'La calificación debe ser entre 1 y 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddItem({
        titulo: formData.titulo.trim(),
        opinion: formData.opinion.trim(),
        nombre: formData.nombre.trim() || 'Anónimo',
        calificacion: parseInt(formData.calificacion),
        categorias: formData.categorias
      });
      
      // Resetear formulario
      setFormData({
        titulo: '',
        opinion: '',
        nombre: 'Anónimo',
        calificacion: 5,
        categorias: []
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Agregar Nueva Review</h2>
      
      {/* Título de la obra */}
      <div className="mb-4">
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
          Título de la obra *
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.titulo ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: Umamusume Cinderella Gray"
          required
        />
        {errors.titulo && (
          <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>
        )}
      </div>

      {/* Opinión */}
      <div className="mb-4">
        <label htmlFor="opinion" className="block text-sm font-medium text-gray-700 mb-1">
          Tu opinión *
        </label>
        <textarea
          id="opinion"
          name="opinion"
          value={formData.opinion}
          onChange={handleChange}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.opinion ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Comparte tu opinión sobre esta obra..."
          required
        />
        {errors.opinion && (
          <p className="text-red-500 text-sm mt-1">{errors.opinion}</p>
        )}
      </div>

      {/* Nombre (opcional) */}
      <div className="mb-4">
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
          Tu nombre (opcional)
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Cómo quieres que te llamemos"
        />
      </div>

      {/* Calificación */}
      <div className="mb-4">
        <label htmlFor="calificacion" className="block text-sm font-medium text-gray-700 mb-1">
          Calificación (1-5) *
        </label>
        <select
          id="calificacion"
          name="calificacion"
          value={formData.calificacion}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.calificacion ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value={1}>★☆☆☆☆ - Mala</option>
          <option value={2}>★★☆☆☆ - Regular</option>
          <option value={3}>★★★☆☆ - Buena</option>
          <option value={4}>★★★★☆ - Muy buena</option>
          <option value={5}>★★★★★ - Excelente</option>
        </select>
        {errors.calificacion && (
          <p className="text-red-500 text-sm mt-1">{errors.calificacion}</p>
        )}
      </div>

      {/* Categorías */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categorías (selecciona una o más)
        </label>
        
        {/* Categorías predefinidas */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
          {categoriasDisponibles.map((categoria) => (
            <label key={categoria} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.categorias.includes(categoria)}
                onChange={() => handleCategoriaChange(categoria)}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm capitalize">{categoria}</span>
            </label>
          ))}
        </div>

        {/* Agregar categoría manual */}
        <div className="flex gap-2">
          <input
            type="text"
            value={categoriaTemporal}
            onChange={(e) => setCategoriaTemporal(e.target.value)}
            placeholder="Otra categoría..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="button"
            onClick={agregarCategoriaManual}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
          >
            Agregar
          </button>
        </div>

        {/* Categorías seleccionadas */}
        {formData.categorias.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Categorías seleccionadas:</p>
            <div className="flex flex-wrap gap-2">
              {formData.categorias.map((categoria) => (
                <span
                  key={categoria}
                  className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {categoria}
                  <button
                    type="button"
                    onClick={() => quitarCategoria(categoria)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
      >
        Publicar Review
      </button>

      <p className="text-xs text-gray-500 mt-3">
        * Campos obligatorios
      </p>
    </form>
  );
}