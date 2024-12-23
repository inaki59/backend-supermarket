import mongoose, { ConnectOptions } from 'mongoose';
import 'dotenv/config'; 

const connectDB = async (): Promise<void> => {
  try {
    const dbUri: string = process.env.MONGO_URI || 'mongodb://localhost:27017/mi_base_de_datos';

    // Conexión a la base de datos
    await mongoose.connect(dbUri, {
      // Usa ConnectOptions para asegurar compatibilidad con TS
    } as ConnectOptions);

    console.log('Conexión a MongoDB exitosa');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Detener la aplicación si no se conecta
  }
};

export default connectDB;
