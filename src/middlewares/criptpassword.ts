import { Schema, Document, model, CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';

interface UserDocument extends Document {
  password: string;

}


const userSchema = new Schema<UserDocument>({
  password: { type: String, required: true },
 
});

userSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next(); 
  try {
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt); 
    next();  
  } catch (error) {
    next(error as CallbackError); 
  }
});


const UserModel = model<UserDocument>('User', userSchema);

export default UserModel;
