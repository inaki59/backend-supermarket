export interface ShoppingListInterface {
    name: string;  // Nombre de la lista (por ejemplo, "Semana 1")
    userIds: string[];  
    code:string,
    products: { 
      productId: string; 
      note?: string;
    }[];  
    createdAt?: Date;  
    updatedAt?: Date;  
  }
