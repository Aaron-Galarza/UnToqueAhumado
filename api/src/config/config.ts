import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error en la conexión a MongoDB: ${error}`);
    process.exit(1); // Cerramos la app si no hay base de datos
  }
};