import { Sequelize } from 'sequelize-typescript';

const db = new Sequelize({
  host: 'localhost',
  dialect: 'mysql',
  username: 'root',
  password: 'zelda128',
});

export default db;
