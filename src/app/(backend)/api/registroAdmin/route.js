import { NextResponse } from 'next/server';
import dbConnect from '@/app/(backend)/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function generarToken(admin){  
  const { _id,email,password,createdAt,updatedAt, ...nombre } = admin;
  return jwt.sign(
    {admin: nombre},
    JWT_SECRET,
    {expiresIn: "1h"}
  );
}

export async function POST(request) {
  try {
    const db = await dbConnect();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email y contraseña son requeridos' 
        },
        { status: 400 }
      );
    }

    const admin = await db.collection('admin')
      .findOne({ 
        email: email.toLowerCase().trim() 
      });

    if (!admin) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Credenciales inválidas' 
        },
        { status: 401 }
      );
    }

    const comparacion = await bcrypt.compare(password, admin.password)
    
    if (!comparacion) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Credenciales inválidas' 
        },
        { status: 401 }
      );
    }
    
        // Generar token JWT
    const token = generarToken(admin);

    // Remover password de la respuesta por seguridad
    const { password: _, ...adminSinContra } = admin;

    const response = NextResponse.json({
      success: true,
      admin: adminSinContra
    });

    // Establecer cookie HTTP-only para mayor seguridad
    response.cookies.set('tokenSesion', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 60 * 60,
      path: '/'
    });

    return response

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const db = await dbConnect();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Falta proporcionar id' },
        { status: 400 }
      );
    }

    const result = await db.collection('reviews').deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Item no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item eliminado correctamente',
    });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}