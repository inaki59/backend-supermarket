export interface PurchaseHistoryInterface {
    listId: string; 
    listName: string; 
    users: string[];
    products: {
      productId: string; 
      quantity: number; 
    }[];
    purchasedAt: Date; 
  }
  