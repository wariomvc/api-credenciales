import { Sequelize } from 'sequelize-typescript';
import Usuario from '../../models/Usuario';
import Cliente from '../../models/Cliente';

class Database {
  /*   public static db: Sequelize = new Sequelize({
    database: 'V8tUnq1239',
    host: '212.47.237.65',
    dialect: 'mysql',
    username: 'V8tUnq1239',
    password: 'CSw8tgVA2e',
  }); */
  MYSQLUSER = 'root';
  MYSQLPASSWORD = '48QsVnL0UHuCrXAMxnwm';
  MYSQLHOST = 'containers-us-west-57.railway.app';
  MYSQLPORT = '7886';
  MYSQLDATABASE = 'railway';
  public static db = new Sequelize(
    `mysql://root:48QsVnL0UHuCrXAMxnwm@containers-us-west-57.railway.app:7886/railway`,
  ); // Example for postgres

  /* public static db: Sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
  }); */
  constructor() {
    Database.db.modelManager.addModel(Usuario);
    Database.db.modelManager.addModel(Cliente);
    Database.db.sync().then(() => {
      console.log('Todas las tablas sincronizadas');
    });
  }
}

export default Database;
