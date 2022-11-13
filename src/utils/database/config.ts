import { Sequelize } from 'sequelize-typescript';

class Database {
  public db: Sequelize;
  constructor() {
    this.db = new Sequelize({
      host: 'localhost',
      dialect: 'mysql',
      username: 'root',
      password: 'zelda128',
    });
  }
  async connect() {
    try {
      await this.db.authenticate();
      console.log('Conexion establecida con la BD');
    } catch (error) {
      console.error(error);
    }
  }
}

export default Database;
