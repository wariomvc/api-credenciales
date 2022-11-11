import express from 'express';
import db from './utils/database/config';
import dotenv from 'dotenv';
import Server from './utils/server';
dotenv.config();

const server = new Server();

server.listen();
/* 
const app = express()
app.use(express.json())

app.use('/api/clientes', require('./routers/clientes.routers'))
 */
const dbConnection = async () => {
  try {
    await db.authenticate();
    console.log('Conexion establecida con la BD');
  } catch (error) {
    console.error(error);
  }
};

dbConnection();
/* app.listen(3000, () => {
  console.log('escuchando')
}) */
