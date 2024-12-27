import { Schema, model, Document, Model } from 'mongoose';
import { UserInterface } from '../interfaces/UserInterface';

// Extendemos Document con UserInterface para que Mongoose reconozca los campos personalizados
interface UserDocument extends UserInterface, Document {}

// Definimos el esquema con los nuevos campos
const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  auth0Id: { type: String, required: false, unique: true },  // ID único de Auth0
  edad: { type: Number, required: false,validate:{validator:Number.isInteger,message:"no es un número entero valido"} },
  email: { type: String, required: false },
  actividad:{type:String,required:true},
  role: { type: String, enum: ['admin', 'user', 'moderator'], default: 'user' }, // Rol del usuario
  status: { type: Boolean, default: true },  // Estado del usuario (activo por defecto)
  lastLogin: { type: Date, required: false },  
  password: { type: String, required: true } 
}, {
  timestamps: true,  // Automáticamente crea createdAt y updatedAt
});

// Creamos el modelo de usuario basado en el esquema
const UserModel: Model<UserDocument> = model<UserDocument>('User', userSchema);

export default UserModel;
