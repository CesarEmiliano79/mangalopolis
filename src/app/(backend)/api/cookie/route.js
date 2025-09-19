import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  try {
    const token = request.cookies.get('tokenUsuario')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    // Decodificar token para obtener usuario (solo payload, no valida firma)
    const decoded = jwt.verify(token, JWT_SECRET);
    
    return NextResponse.json({ user: decoded.user });
  } catch (error) {
    console.error('Error al obtener cookie:', error);
    return NextResponse.json({ user: null });
  }
}

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('authToken', '', { maxAge: 0, path: '/' });
  return response;
}
