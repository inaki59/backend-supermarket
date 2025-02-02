export interface UserInterface {
    name: string;
    email?: string;
    edad?:number;
    actividad:string;
    createdAt: Date;
    updatedAt: Date;
    password: string;
    role?: string;     
    authProvider: 'local' | 'google'; 
    lastLogin?: Date;  
    status?: boolean;   
  }
  