import { Schema, model, Document } from 'mongoose';
import { ProductInterface } from '../interfaces/ProductInteface';

interface ProductDocument extends ProductInterface, Document {}

const productSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  defaultQuantity: { type: Number, required: true }
}, {
  timestamps: true  // Para tener createdAt y updatedAt automáticamente
});

const ProductModel = model<ProductDocument>('Product', productSchema);

export default ProductModel;
