import { NextResponse } from 'next/server';
import dbConnect from '@/app/(backend)/lib/mongodb';
import {isDisposable, valido} from '../../lib/validar/Email';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

async function verificarAdmin(request) {
  try {
    const token = request.cookies.get('tokenSesion')?.value; // Obtener header
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.admin && decoded.admin.role === 'admin';
  } catch (err) {
    console.log("No se pudo verificar el token:", err.message);
    return false;
  }
}

// POST - Crear nuevo usuario
export async function POST(request) {
  try {
    const esAdmin = await verificarAdmin(request);
    if (!esAdmin) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }
    const db = await dbConnect();
    const body = await request.json();

    // Validaciones
    if (
      !body || 
      typeof body.email !== 'string' || 
      typeof body.password !== 'string'
    ){
      return NextResponse.json(
        {success: false, error: 'Error en los parametros'}
      );
    }

    if (body.name && typeof body.name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'El nombre debe ser un string' },
        { status: 400 }
      );
    }

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

    if (await isDisposable(body.email) || !(await valido(body.email))) {
      return NextResponse.json(
        { success: false, error: 'Email no permitido' },
        { status: 400 }
      );
    }



    // Verificar si el usuario ya existe
    const usuarioExistente = await db.collection('admin')
      .findOne({ email: body.email.toLowerCase().trim() });

    if (usuarioExistente) {
      return NextResponse.json(
        { success: false, error: 'El usuario ya existe' },
        { status: 409 }
      );
    }

    // Crear nuevo usuario
    const nuevoAdmin = {
      name: body.name?.trim() || '',
      email: body.email.toLowerCase().trim(),
      password: body.password,
      createdAt: new Date(),
      role: 'admin'
    };

    const result = await db.collection('admin').insertOne(nuevoAdmin);
    
    // Obtener usuario sin password
    const usuarioCreado = await db.collection('admin')
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