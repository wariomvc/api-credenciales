import dotenv from 'dotenv'; //Libreria para usar variables de entorno

import Database from './utils/database/config'; // Modulo que manega la configuración de la BD
import Server from './utils/server'; // Servidor de express

dotenv.config(); //Carga la configuraición de las variables de entorno

// Genera instancia del servidor
const database = new Database(); // Genera uns intanacia de la Basededato

const dbConnection = async () => {
  try {
    //await database.db?.authenticate();
    await Database.db.authenticate();
    //await Database.db.sync();
    console.log('Autenticado en al DB');
  } catch (error) {
    console.error(error);
  }
};
console.log(Database.db.config);
dbConnection();
const server = new Server();
server.listen();
