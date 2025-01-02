export interface ShoppingListInterface {
    name: string;  // Nombre de la lista (por ejemplo, "Semana 1")
    userIds: string[];  
    code:string,
    productIds: string[];  
    createdAt?: Date;  
    updatedAt?: Date;  
  }
