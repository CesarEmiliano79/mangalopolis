import { NextResponse } from 'next/server';
import dbConnect from '@/app/(backend)/lib/mongodb';
import jwt from 'jsonwebtoken';

async function verificarUsuario(request) {
  try {
    const token = request.cookies.get('tokenSesion')?.value;
    const decoded = jwt.verify(token, SECRET);
    return decoded.role === 'otakufan';
  } catch (err) {
    return false;
  }
}

// POST - Crear nueva review (este está bien)
export async function POST(request) {

  const sesionActiva = await verificarUsuario(request);
  if (!sesionActiva) {
    return NextResponse.json(
      { success: false, error: 'No autorizado' },
      { status: 401 }
    );
  }

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

    if (!body.nombre){
      return NextResponse.json(
        { 
          success: false, 
          error: 'Accion invalida' 
        },
        { status: 400 }
      );
    }

    // Validar calificación si existe
    if (body.calificacion && (body.calificacion < 1 || body.calificacion > 5) && typeof body.calificacion !=='number') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'La calificación debe estar entre 1 y 5' 
        },
        { status: 400 }
      );
    }

    if (!body){
      return NextResponse.json(
        { 
          success: false, 
          error: 'Accion invalida' 
        },
        { status: 400 }
      );
    }

    if(typeof body.titulo !== 'string' ||
      typeof body.opinion !== 'string' ||
      typeof body.nombre !== 'string'
    ){
      return NextResponse.json(
        { 
          success: false, 
          error: 'Accion invalida' 
        },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(body.tags) ||                  // No es un array
      body.tags.length === 0 ||                     // Está vacío
      !body.tags.every(item => typeof item === "string" && item.trim() !== "") // Contiene elementos no string o vacíos
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Accion invalida",
        },
        { status: 400 }
      );
    }

    // Crear nueva review
    const nuevaReview = {
      titulo: body.titulo.trim(),
      opinion: body.opinion.trim(),
      nombre: body.nombre || 'Anónimo',
      publicado: new Date(),
      calificacion: body.calificacion,
      categorias: body.categorias || ['Opinion personal'],
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

// GET - Obtener todas las reviews
export async function GET(request) {
  try {
    const db = await dbConnect();

    const { searchParams } = new URL(request.url);
    let page = parseInt(searchParams.get('page'));
    let limit = parseInt(searchParams.get('limit'));
    const search = searchParams.get('search');
    const categoria = searchParams.get('categoria');

    // --- VALIDACIONES DE ENTRADA ---
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1 || limit > 100) limit = 10;

    // Construir query de búsqueda
    const query = {};

    // Validar y aplicar el parámetro "search"
    if (typeof search === 'string' && search.trim().length > 0) {
      query.$or = [
        { titulo: { $regex: search.trim(), $options: 'i' } },
        { opinion: { $regex: search.trim(), $options: 'i' } },
        { nombre: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Validar y aplicar "categoria"
    if (typeof categoria === 'string' && categoria.trim().length > 0) {
      query.categorias = { $in: [categoria.trim()] };
    }

    const skip = (page - 1) * limit;

    // --- CONSULTA A LA BD ---
    const reviews = await db
      .collection('reviews')
      .find(query)
      .sort({ publicado: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('reviews').countDocuments(query);

    // --- VALIDACIÓN Y LIMPIEZA DE SALIDA ---
    const reviewsLimpias = reviews
      .filter(review =>
        review &&
        typeof review.titulo === 'string' &&
        typeof review.opinion === 'string' &&
        typeof review.nombre === 'string' &&
        (!review.calificacion ||
          (typeof review.calificacion === 'number' &&
           review.calificacion >= 1 &&
           review.calificacion <= 5)) &&
        Array.isArray(review.categorias) &&
        review.categorias.every(c => typeof c === 'string')
      )
      .map(review => ({
        _id: review._id,
        titulo: review.titulo.trim(),
        opinion: review.opinion.trim(),
        nombre: review.nombre.trim(),
        publicado: review.publicado,
        calificacion: review.calificacion ?? null,
        categorias: review.categorias,
        tags: Array.isArray(review.tags)
          ? review.tags.filter(t => typeof t === 'string' && t.trim() !== '')
          : [],
      }));

    return NextResponse.json({
      success: true,
      data: reviewsLimpias,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener las reviews',
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}