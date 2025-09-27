import { NextResponse } from 'next/server';
import dbConnect from '@/app/(backend)/lib/mongodb';
import isDisposable from '../../lib/validar/Email';
import { validateContra, validateEmail, validateUser } from '../../lib/validar/sanitizar';
import { hashearPassword } from '../../lib/seguridad/encriptar';

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
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'El nombre es requerido' },
        { status: 400 }
      );
    }

    // Validar email
    const emailValidado = validateEmail(body.email);
    if (emailValidado instanceof NextResponse) return emailValidado;

    // Validar nombre
    const nameValidado = validateUser(body.name);
    if (nameValidado instanceof NextResponse) return nameValidado;

    // Validar contraseña
    const passwordValidada = validateContra(body.password);
    if (passwordValidada instanceof NextResponse) return passwordValidada;

    // Hashear contraseña
    const pswHasheada = await hashearPassword(passwordValidada);



    // Verificar si el email es desechable
    if (await isDisposable(emailValidado)) {
      return NextResponse.json(
        { success: false, error: 'Email no permitido' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await db.collection('admin').findOne({ email: body.email.toLowerCase().trim() });

    if (usuarioExistente) {
      return NextResponse.json(
        { success: false, error: 'El usuario ya existe' },
        { status: 409 }
      );
    }

    // Crear nuevo usuario
    const nuevoAdmin = {
      name: nameValidado,
      email: emailValidado.toLowerCase().trim(),
      password: pswHasheada,
      createdAt: new Date(),
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