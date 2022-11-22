import { Sequelize } from 'sequelize-typescript';
import Usuario from '../../models/Usuario';
import Cliente from '../../models/Cliente';

class Database {
  public static db: Sequelize = new Sequelize({
    database: 'appcredenciales',
    host: process.env.DATABASEHOST,
    dialect: 'mysql',
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
  });
  constructor() {
    Database.db.modelManager.addModel(Usuario);
    Database.db.modelManager.addModel(Cliente);
    Database.db.sync().then(() => {
      console.log('Todas las tablas sincronizadas');
    });
  }
}

export default Database;
