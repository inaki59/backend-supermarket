import { Schema, model, Document } from 'mongoose';
import { ShoppingListInterface } from '../interfaces/ShoppingListInterface';

// Extendemos Document para incluir los campos de Mongoose
interface ShoppingListDocument extends ShoppingListInterface, Document {}

const shoppingListSchema = new Schema<ShoppingListDocument>({
  name: { type: String, required: true },
  userIds: { type: [String], required: true },  // Almacena los IDs de los usuarios que tienen esta lista
  productIds: { type: [String], required: true },  // Almacena los IDs de los productos
}, {
  timestamps: true,  // Mongoose manejará createdAt y updatedAt automáticamente
});

// Creamos el modelo para la lista de la compra
const ShoppingListModel = model<ShoppingListDocument>('ShoppingList', shoppingListSchema);

export default ShoppingListModel;
