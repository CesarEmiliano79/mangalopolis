import { NextResponse } from 'next/server';
import dbConnect from '@/app/(backend)/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function generarToken(usuario){  
  const { _id,email,password,createdAt,updatedAt, ...nombre } = usuario;
  return jwt.sign(
    {user: nombre},
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

    const user = await db.collection('usuario')
      .findOne({ 
        email: email.toLowerCase().trim() 
      });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Credenciales inválidas' 
        },
        { status: 401 }
      );
    }

    const comparacion = await bcrypt.compare(password, user.password)

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
    const token = generarToken(user);

    // Remover password de la respuesta por seguridad
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword
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