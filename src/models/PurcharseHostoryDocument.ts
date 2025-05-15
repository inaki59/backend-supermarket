import { Schema, model, Document, Types } from 'mongoose';

// Definimos una subestructura para los productos en el historial
interface ProductEntry {
  productId: string;
  note: string;
}

// Extendemos Document para incluir los campos del historial
interface PurchaseHistoryDocument extends Document {
  listId: Types.ObjectId;  
  listName: string;
  users: Types.ObjectId[];  
  products: ProductEntry[];
  purchasedAt: Date;
}

// Creamos un esquema para los productos dentro del historial
const ProductEntrySchema = new Schema<ProductEntry>({
  productId: { type: String, required: true },
  note: { type: String, required: true, min: 1 },
});

// Creamos el esquema para el historial de compras
const PurchaseHistorySchema = new Schema<PurchaseHistoryDocument>({
  listId: { type: Schema.Types.ObjectId, ref: 'ShoppingLists', required: true },  
  listName: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],  
  products: { type: [ProductEntrySchema], required: true },
  purchasedAt: { type: Date, required: true },
}, { timestamps: true }); 

const PurchaseHistoryModel = model<PurchaseHistoryDocument>('PurchaseHistory', PurchaseHistorySchema);

export default  PurchaseHistoryModel
