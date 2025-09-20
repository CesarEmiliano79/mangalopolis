'use client'

import CrearUsuario from "../../../(backend)/components/formularioNue";
import { useState } from 'react';

export default function Page() {
    const [loading, setLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const handleAddItem = async (newItem) => {
        setLoading(true);
        setConnectionStatus('loading');
        setMessage('');

        try {
            console.log('Creando Usuario...');
            const response = await fetch('/api/crearAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                setMessage('Usuario creado exitosamente!');
                setConnectionStatus('success');
                
                // Limpiar el mensaje después de 3 segundos
                setTimeout(() => {
                    setMessage('');
                    setConnectionStatus('idle');
                }, 3000);
                
                // Opcional: redirigir al login después de éxito
                setTimeout(() => {
                    window.location.href = '/revision';
                }, 2000);
                
            } else {
                setMessage(result.error || 'Error al crear usuario');
                setConnectionStatus('error');
            }
        } catch (error) {
            console.error('Error adding item:', error);
            setMessage('Error de conexión al crear usuario');
            setConnectionStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Registro de Admin</h1>
                    </div>
                    
                    {/* Mensajes de estado */}
                    {message && (
                        <div className={`mb-4 p-3 rounded text-center ${
                            connectionStatus === 'success' 
                                ? 'bg-green-100 border border-green-400 text-green-700' 
                                : 'bg-red-100 border border-red-400 text-red-700'
                        }`}>
                            {message}
                        </div>
                    )}
                    
                    <CrearUsuario 
                        onAddUser={handleAddItem} 
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
}