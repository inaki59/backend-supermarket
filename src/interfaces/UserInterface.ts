export interface UserInterface {
    name: string;
    auth0Id: string;
    email?: string;
    edad:number;
    actividad:string;
    createdAt: Date;
    updatedAt: Date;
    password: string;
    role?: string;      
    lastLogin?: Date;  
    status?: boolean;   
  }
  