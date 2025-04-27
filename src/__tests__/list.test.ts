import request from 'supertest';
import app from "../app"; 
import mongoose from 'mongoose';
import ShoppingListModel from '../models/ShoppingListModel';
import jwt from 'jsonwebtoken';
import { getUserById } from '../controllers/createUser';
import UserModel from '../models/UserModel';
import { listenerCount } from 'process';

const secretKey =  process.env.SECRET_KEY as string; 
let codeList:string="";
describe(' pruebas de la lista', () => {

  it('crear lista de la compra', async () => {
   // Datos de prueba
      const userData = {
        name: 'prueba',
        email: `lista-${Date.now()}@example.com`, // Email único
        password: 'pepe',
        edad: 23,
        actividad: 'Activa',
        role: 'user',
        authProvider: 'local',
      };
  
      // (`Base de datos actual: ${mongoose.connection.db?.databaseName}`);
      // 1. crear usuario
      const res = await request(app)
        .post('/api/users')
        .send(userData);
        const loginBody={
              user:userData.email,
              password:userData.password
            }
            const loginRes=await request(app)
            .post("/api/users/login")
            .send(loginBody)
            expect(res.status).toBe(201);
        const token:any=loginRes.body.token
        const listRes = await request(app)
        .post('/api/list')
        .set('Authorization', `${token}`)
        .send({ 
          name: "Lista Test"
        });
        codeList=listRes.body.code
      expect(listRes.status).toBe(201);

    })

    it('debería crear usuarios, lista grupal y unirse correctamente', async () => {
      // Datos de prueba
    // Datos de prueba
    const userData = {
      name: 'prueba',
      email: `goku-${Date.now()}@example.com`, // Email único
      password: 'dragonball',
      edad: 23,
      actividad: 'Activa',
      role: 'user',
      authProvider: 'local',
    };

    // (`Base de datos actual: ${mongoose.connection.db?.databaseName}`);
    // 1. crear usuario
    const res = await request(app)
      .post('/api/users')
      .send(userData);
      expect(res.status).toBe(201);
      await new Promise(resolve => setTimeout(resolve, 700));
      const loginBody={
            email:userData.email,
            password:userData.password
          }
          const loginRes=await request(app)
          .post("/api/users/login")
          .send(loginBody)
          expect(loginRes.status).toBe(200);
          console.log(loginRes.body)
          expect(loginRes.body.token).toBeDefined();
          expect(loginRes.body).toHaveProperty('token');
          const token = loginRes.body.token;
      const joinRes = await request(app)
        .post('/api/list/group')
        .set('Authorization', ` ${token}`)  
        .send({ code: codeList });
      console.log(joinRes.body)
     expect(joinRes.status).toBe(200);

   });
   
    
});
