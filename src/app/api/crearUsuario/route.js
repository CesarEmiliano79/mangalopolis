import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

// POST - Crear nuevo usuario
export async function POST(request) {
  try {
    const db = await dbConnect();
    const body = await request.json();
    
    // Validaciones
    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: 'Email y password son requeridos' },
        { status: 400 }
      );
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await db.collection('usuario')
      .findOne({ email: body.email.toLowerCase().trim() });

    if (usuarioExistente) {
      return NextResponse.json(
        { success: false, error: 'El usuario ya existe' },
        { status: 409 }
      );
    }

    // Crear nuevo usuario
    const nuevoUsuario = {
      name: body.name?.trim() || '',
      email: body.email.toLowerCase().trim(),
      password: body.password,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('usuario').insertOne(nuevoUsuario);
    
    // Obtener usuario sin password
    const usuarioCreado = await db.collection('usuario')
      .findOne({ _id: result.insertedId }, { projection: { password: 0 } });

    return NextResponse.json(
      { 
        success: true, 
        data: usuarioCreado,
        message: 'Usuario creado exitosamente'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}