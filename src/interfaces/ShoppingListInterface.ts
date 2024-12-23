export interface ShoppingListInterface {
    name: string;  // Nombre de la lista (por ejemplo, "Semana 1")
    userIds: string[];  // IDs de los usuarios asociados a la lista
    productIds: string[];  // IDs de los productos que están en la lista
    createdAt?: Date;  // Fecha de creación de la lista (opcional, puede ser manejado por Mongoose)
    updatedAt?: Date;  // Fecha de la última actualización (opcional, también por Mongoose)
  }
