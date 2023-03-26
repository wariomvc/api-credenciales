import { Sequelize } from 'sequelize-typescript';
import Usuario from '../../models/Usuario';
import Cliente from '../../models/Cliente';
import Premio from '../../models/Premio';
import dotenv from 'dotenv';
import { createNoSubstitutionTemplateLiteral } from 'typescript';

dotenv.config();

class Database {
  public static db: Sequelize = new Sequelize({
    port: parseInt(process.env.DBPORT!),
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: 'mysql',
    username: process.env.DBUSER,
    password: process.env.PASSWORD,
  }); // Example for postgres
  /* public static db = new Sequelize(
    `mysql://root:48QsVnL0UHuCrXAMxnwm@containers-us-west-57.railway.app:7886/railway`,
  ) */ /* public static db: Sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
  }); */
  constructor() {
    console.log(Database.db.config);
    Cliente.hasMany(Premio);
    Premio.belongsTo(Cliente);
    Database.db.modelManager.addModel(Usuario);
    Database.db.modelManager.addModel(Cliente);
    Database.db.modelManager.addModel(Premio);
    Database.db.sync({ alter: true }).then(() => {
      console.log('Todas las tablas sincronizadas');
    });
  }
}

export default Database;
