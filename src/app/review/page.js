'use client'

import { useState, useEffect } from 'react';
import ListaRe from "../components/listadoRe";
import CrearReview from '../components/agregarRe';

export default function Page() {
  const [reviews, setReview] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/review');
      const data = await response.json();
      setReview(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (newItem) => {
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      
      if (response.ok) {
        fetchItems(); // Recargar los items
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-blue-100 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Reviews Recientes</h1>
        <ListaRe reviews={reviews}/>
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Agregar Nuevo Item</h2>
        <CrearReview onAddItem={handleAddItem} />
      </div>
    </div>
  );
}
