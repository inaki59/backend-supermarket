import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Server } from 'http';
import express from 'express';

// 1. Carga segura de variables de entorno
dotenv.config({ path: '.env.test' });

// 2. Tipado explícito para variables de entorno
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI_TEST: string;
      NODE_ENV: 'test' | 'development' | 'production';
    }
  }
}

let server: Server;
let mongooseConnection: typeof mongoose;

beforeAll(async () => {
  // 3. Validaciones tipo TypeScript
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('❌ Ejecutando tests en entorno incorrecto!');
  }

  if (!process.env.MONGO_URI_TEST?.includes('test-backend')) {
    throw new Error('❌ URI de MongoDB no apunta a entorno de pruebas');
  }

  // 4. Conexión tipada correctamente con manejo de conexión existente
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    mongooseConnection = await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ignoreUndefined: true,
    } as mongoose.ConnectOptions);

    console.log(`✅ Conectado a MongoDB: `);

  } catch (error) {
    console.error('🔥 Error de conexión:', error);
    throw error;
  }

  // 5. Servidor Express con tipado correcto
  const app = express();
  server = app.listen(0); // Usamos puerto 0 para asignación automática
});

afterEach(async () => {
  // Limpieza opcional (comenta si quieres conservar datos)
  // Aquí podrías limpiar colecciones si lo necesitas entre tests, pero no es necesario si lo haces en afterAll
});

afterAll(async () => {
  // 6. Limpieza de colecciones después de todos los tests
  try {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      await collections[key].deleteMany({});
    }

    // 7. Desconexión ordenada con manejo de errores
    if (mongooseConnection?.connection?.readyState === 1) {
      await mongooseConnection.disconnect();
    }

    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err?: Error) => {
          err ? reject(err) : resolve();
        });
      });
    }
  } catch (error) {
    console.error('Error en afterAll:', error);
  }
});
