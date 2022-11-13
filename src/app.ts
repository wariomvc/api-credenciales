import dotenv from 'dotenv'; //Libreria para usar variables de entorno

import Database from './utils/database/config'; // Modulo que manega la configuración de la BD
import Server from './utils/server'; // Servidor de express

dotenv.config(); //Carga la configuraición de las variables de entorno
const server = new Server(); // Genera instancia del servidor
const database = new Database(); // Genera uns intanacia de la Basededato
server.listen();

const dbConnection = async () => {
  try {
    await database.db.authenticate();
    console.log('Conexion establecida con la BD');
  } catch (error) {
    console.error(error);
  }
};
dbConnection();
