import { Sequelize } from 'sequelize';

/* const db = new Sequelize({
  database: 'railway',
  host: 'containers-us-west-57.railway.app',
  dialect: 'mysql',
  username: 'root',
  password: '48QsVnL0UHuCrXAMxnwm',
}); */
const MYSQLUSER = 'root';
const MYSQLPASSWORD= '48QsVnL0UHuCrXAMxnwm';
const MYSQLHOST ='containers-us-west-57.railway.app';
 const MYSQLPORT = '7886';
const MYSQLDATABASE = 'railway';
//const db = new Sequelize(`mysql://${MYSQLUSER}:${{ MYSQLPASSWORD }}@${{ MYSQLHOST }}:${{ MYSQLPORT }}/${{ MYSQLDATABASE }}`) ;// Example for postgres
const db = new Sequelize(
  `mysql://root:48QsVnL0UHuCrXAMxnwm@containers-us-west-57.railway.app:7886/railway`,
);
export default db;
