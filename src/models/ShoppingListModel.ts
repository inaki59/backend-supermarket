import { Schema, model, Document, Types } from 'mongoose';
import { ShoppingListInterface } from '../interfaces/ShoppingListInterface';

// Extendemos Document para incluir los campos de Mongoose
interface ShoppingListDocument extends ShoppingListInterface, Document {}

const shoppingListSchema = new Schema<ShoppingListDocument>({
  name: { type: String, required: true },
  userIds: [{ type: Types.ObjectId, ref: 'User', required: true }],  
  productIds: { type: [String], required: true }, 
}, {
  timestamps: true, 
});

// Creamos el modelo para la lista de la compra
const ShoppingListModel = model<ShoppingListDocument>('ShoppingList', shoppingListSchema);

export default ShoppingListModel;

