import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Porfavor, solicitar clave de MONGODB_URI al personal especializado');
}

// Variable global para cachear la conexión
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null, client: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {

    console.log('Estableciendo nueva conexion ...');
    
    cached.promise = MongoClient.connect(MONGODB_URI)
      .then((client) => {
        console.log('Conexion exitosa');
        cached.client = client;
        return client.db('usuarios'); // Retorna la base de datos por defecto
      })
      .catch((error) => {
        console.error('Conexion fallida:', error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

// Función para obtener el cliente (útil para operaciones específicas)
export function getMongoClient() {
  return cached.client;
}

export default dbConnect;