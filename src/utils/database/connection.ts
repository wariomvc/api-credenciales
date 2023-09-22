import { Sequelize } from 'sequelize';



console.log('***********',process.env.DATABASE);
const db: Sequelize = new Sequelize({
  port: parseInt(process.env.DBPORT!),
  database: process.env.DATABASE,
  host: process.env.HOST,
  dialect: 'mysql',
  username: process.env.DBUSER,
  password: process.env.PASSWORD,
}); 
/* const MYSQLUSER = 'root';
const MYSQLPASSWORD= '48QsVnL0UHuCrXAMxnwm';
const MYSQLHOST ='containers-us-west-57.railway.app';
 const MYSQLPORT = '7886';
const MYSQLDATABASE = 'railway';
//const db = new Sequelize(`mysql://${MYSQLUSER}:${{ MYSQLPASSWORD }}@${{ MYSQLHOST }}:${{ MYSQLPORT }}/${{ MYSQLDATABASE }}`) ;// Example for postgres
const db = new Sequelize(
  `mysql://root:48QsVnL0UHuCrXAMxnwm@containers-us-west-57.railway.app:7886/railway`,
); */
export default db;
