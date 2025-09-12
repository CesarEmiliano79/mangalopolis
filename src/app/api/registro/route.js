import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function POST(request) {
  try {
    const db = await dbConnect();
    
    // Obtener datos del body
    const { email, password } = await request.json();

    // Validaciones básicas
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email y contraseña son requeridos' 
        },
        { status: 400 }
      );
    }

    // Buscar usuario por email
    const user = await db.collection('usuario')
      .findOne({ 
        email: email.toLowerCase().trim() 
      });

    // Verificar si el usuario existe
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Credenciales inválidas' 
        },
        { status: 401 }
      );
    }

    // TEMPORAL: Comparar contraseña sin bcrypt
    // (Reemplazar esto luego con bcrypt.compare)
    if (password !== user.password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Credenciales inválidas' 
        },
        { status: 401 }
      );
    }

    // Remover password de la respuesta por seguridad
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        success: true, 
        data: {
          user: userWithoutPassword,
          message: 'Login exitoso'
        }
      },
      { status: 200 }
    );

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