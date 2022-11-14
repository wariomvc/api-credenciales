import { Sequelize } from 'sequelize';

const db = new Sequelize({
  database: 'appcredenciales',
  host: 'localhost',
  dialect: 'mysql',
  username: 'root',
  password: 'zelda128',
});

export default db;
