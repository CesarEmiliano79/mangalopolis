'use client';

import { useState,useEffect } from 'react';
import bcrypt from 'bcryptjs'



export default function CrearAdmin({ onAddUser}) {

  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [creadoPor, setCreado]= useState('');
  const [errors, setErrors] = useState({});


  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch('/api/cookieAdmin'); // llama al endpoint del paso 1
        if (!res.ok) throw new Error('No autorizado');
        const data = await res.json();
        setCreado(data.name);
      } catch (err) {
        console.error(err.message);
        setCreado(null);
      }
    };

    fetchAdmin();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!edad || edad === '' || parseInt(edad) <= 0) {
      newErrors.edad = 'La edad es requerida y debe ser mayor a 0';
    }

    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!contrasena) {
      newErrors.contrasena = 'La contraseña es requerida';
    } else if (contrasena.length < 6) {
      newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!creadoPor){
        newErrors.creadoPor = 'Admin no registrado'
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const contraHasheada = await bcrypt.hash(contrasena,10)
      onAddUser({ 
        name: nombre.trim(),     
        edad: parseInt(edad), 
        email: email.trim(),    
        password: contraHasheada,
        creadoPor: admin  
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
      <div className="mb-4">
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre
        </label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.nombre ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.nombre && (
          <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="edad" className="block text-sm font-medium text-gray-700 mb-1">
          Edad
        </label>
        <input
          type="number"
          id="edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          min="1"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.edad ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.edad && (
          <p className="text-red-500 text-sm mt-1">{errors.edad}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          E-mail
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder='tu@email.com'
          required
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          type="password"
          id="contrasena"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.contrasena ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.contrasena && (
          <p className="text-red-500 text-sm mt-1">{errors.contrasena}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Crear Usuario
      </button>
    </form>
  );
}