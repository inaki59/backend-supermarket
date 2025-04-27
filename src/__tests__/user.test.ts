import app from "../app"; 
import request from 'supertest';
import mongoose from 'mongoose';
import UserModel from "../models/UserModel";
import jwt from 'jsonwebtoken';
const secret = process.env.SECRET_KEY as string; 
describe('prueba usuarios', () => {
  it('debería crear un usuario local', async () => {
    // Datos de prueba
    const userData = {
      name: 'florentino',
      email: `florentino-${Date.now()}@example.com`, // Email único
      password: 'pepe',
      edad: 23,
      actividad: 'Activa',
      role: 'user',
      authProvider: 'local',
    };

    // (`Base de datos actual: ${mongoose.connection.db?.databaseName}`);

    // 1. Ejecuta la petición
    const res = await request(app)
      .post('/api/users')
      .send(userData);

    // 2. Verifica respuesta
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Usuario creado correctamente.');

    // 3. Verifica en DB (con timeout para dar tiempo a MongoDB)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userInDB = await UserModel.findOne({ email: userData.email }).lean();

    
    expect(userInDB).toBeTruthy();

  });
  it('login exitoso', async () => {
    // Datos de prueba
    const userData = {
      name: 'prueba',
      email: `prueba-${Date.now()}@example.com`, // Email único
      password: 'pepe',
      edad: 23,
      actividad: 'Activa',
      role: 'user',
      authProvider: 'local',
    };

    (`Base de datos actual: ${mongoose.connection.db?.databaseName}`);

    // 1. crear usuario
    const res = await request(app)
      .post('/api/users')
      .send(userData);
    const loginBody={
      user:userData.email,
      password:userData.password
    }
    const login=await request(app)
    .post("/api/users/login")
    .send(loginBody)
    expect(res.status).toBe(201);
 


    // 3. Verifica en DB (con timeout para dar tiempo a MongoDB)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userInDB = await UserModel.findOne({ email: userData.email }).lean();

    
    expect(userInDB).toBeTruthy();

  });
  it('login fallido por contraseña incorrecta', async () => {
    // Datos de prueba
    const userData = {
      name: 'fallido',
      email: `fallido-${Date.now()}@example.com`, // Email único
      password: 'correcta',
      edad: 25,
      actividad: 'Activa',
      role: 'user',
      authProvider: 'local',
    };
  
    // 1. Crear usuario
    await request(app)
      .post('/api/users')
      .send(userData);
  
    // 2. Intentar login con contraseña incorrecta
    const loginBody = {
      user: userData.email,
      password: 'incorrecta',
    };
  
    const login = await request(app)
      .post('/api/users/login')
      .send(loginBody);
  
    // 3. Comprobaciones
    expect(login.status).toBe(400); 
  });
  it('logout exitoso', async () => {
    // Datos de prueba
    const userData = {
      name: 'logout',
      email: `logout-${Date.now()}@example.com`, // Email único
      password: 'pepe',
      edad: 23,
      actividad: 'Activa',
      role: 'user',
      authProvider: 'local',
    };

  

    // 1. crear usuario
    const res = await request(app)
      .post('/api/users')
      .send(userData);
    const loginBody={
      user:userData.email,
      password:userData.password
    }
    const loginres=await request(app)
    .post("/api/users/login")
    .send(loginBody)
    expect(res.status).toBe(201);

    // 3. Verifica en DB (con timeout para dar tiempo a MongoDB)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userInDB = await UserModel.findOne({ email: userData.email }).lean();

    
    expect(userInDB).toBeTruthy();
    expect(userInDB?.email).toBe(userData.email);


  });

  it('debería cerrar sesión correctamente con un token válido', async () => {
    // Crear usuario de prueba
    const userData = {
      name: 'LogoutUser',
      email: `logout-${Date.now()}@example.com`,
      password: 'logout123',
      edad: 28,
      actividad: 'Activa',
      role: 'user',
      authProvider: 'local',
    };

    // 1. Crear usuario
    const createRes = await request(app)
      .post('/api/users')
      .send(userData);
    expect(createRes.statusCode).toBe(201);

    // Pequeña pausa para asegurar procesamiento
    await new Promise(resolve => setTimeout(resolve, 500));

    // 2. Hacer login
    const loginRes = await request(app)
      .post("/api/users/login")
      .send({
        email: userData.email,
        password: userData.password
      });
    
    // Verificaciones del login
    expect(loginRes.status).toBe(200); // El login exitoso debe devolver 200
    expect(loginRes.body).toHaveProperty('token');


    const token = loginRes.body.token;
    
    // 3. Verificar y decodificar el token
    let decoded: any;
    try {
      decoded = jwt.verify(token, "arrevedirti"); // Asegúrate que coincide con tu SECRET_KEY real
  
    } catch (error) {
      console.error("Error al verificar el token:", error);
      throw error;
    }

    const userId = decoded.id;


    // 4. Hacer logout
    const logoutRes = await request(app)
      .post(`/api/users/logout/${userId}`)
      .set('Authorization', ` ${token}`); 

    // 5. Verificar respuesta del logout
  
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body).toHaveProperty('message');
    expect(logoutRes.body.message).toMatch(/Logout exitoso para el usuario /);
});
it('debería devolver 404 si el token es inválido', async () => {
  const logoutRes = await request(app)
    .post('/api/logout')
    .set('Authorization', 'token-falso');

  expect(logoutRes.status).toBe(404);


});
it('usuario eliminado', async () => {
  const userData = {
    name: 'delete',
    email: `delete-${Date.now()}@example.com`,
    password: 'correcta',
    edad: 25,
    actividad: 'Activa',
    role: 'user',
    authProvider: 'local',
  };

  // Crear usuario
  const res = await request(app)
      .post('/api/users')
      .send(userData);

  // Login
  const loginRes = await request(app)
    .post('/api/users/login')
    .send({ email: userData.email, password: userData.password });

  expect(loginRes.status).toBe(200);
  
  const token = loginRes.body.token;
  let decoded: any = jwt.verify(token, secret);
  const userId = decoded.id;

  // Eliminar usuario con token en el header
  const deleteUserRes = await request(app)
    .delete(`/api/users/${userId}`)
    .set('Authorization', `${token}`); // Añade el token aquí

  expect(deleteUserRes.statusCode).toBe(200);
});

});
