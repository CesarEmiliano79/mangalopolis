import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

// POST - Crear nueva review (este está bien)
export async function POST(request) {
  try {
    const db = await dbConnect();
    const body = await request.json();
    
    // Validaciones
    if (!body.titulo || !body.opinion) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Falta el título de la obra o tu opinión acerca de esta' 
        },
        { status: 400 }
      );
    }

    // Validar calificación si existe
    if (body.calificacion && (body.calificacion < 1 || body.calificacion > 5)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'La calificación debe estar entre 1 y 5' 
        },
        { status: 400 }
      );
    }

    // Crear nueva review
    const nuevaReview = {
      titulo: body.titulo.trim(),
      opinion: body.opinion.trim(),
      nombre: body.nombre?.trim() || 'Anónimo',
      publicado: new Date(),
      calificacion: body.calificacion || null,
      categorias: body.categorias || [],
    };

    const result = await db.collection('reviews').insertOne(nuevaReview);
    
    // Obtener la review creada
    const reviewCreada = await db.collection('reviews')
      .findOne({ _id: result.insertedId });

    return NextResponse.json(
      { 
        success: true, 
        data: reviewCreada,
        message: 'Tu opinión se creó exitosamente'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// GET - Obtener todas las reviews (CÓDIGO CORREGIDO)
export async function GET(request) {
  try {
    console.log('Hola luisillo');
    const db = await dbConnect();
    
    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    const search = searchParams.get('search');
    const categoria = searchParams.get('categoria');

    // Construir query de búsqueda
    const query = {};
    
    if (search) {
      query.$or = [
        { titulo: { $regex: search, $options: 'i' } },
        { opinion: { $regex: search, $options: 'i' } },
        { nombre: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (categoria) {
      query.categorias = { $in: [categoria] };
    }

    // Obtener reviews con paginación
    const reviews = await db.collection('reviews')
      .find(query)
      .sort({ publicado: -1 }) // Más recientes primero
      .skip(skip)
      .limit(limit)
      .toArray();

    // Obtener total para paginación
    const total = await db.collection('reviews').countDocuments(query);

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener las reviews',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}