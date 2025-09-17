import { NextResponse } from 'next/server';
import dbConnect from '@/app/(backend)/lib/mongodb';
import { ObjectId } from 'mongodb';

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

    const user = await db.collection('admin')
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

    if (password !== user.password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Credenciales inválidas' 
        },
        { status: 401 }
      );
    }

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