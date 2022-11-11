import { Sequelize } from 'sequelize-typescript'

const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'mysql',
  username: 'root',
  password: 'zelda128',
})
const dbConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('Conexion establecida con la BD')
  } catch (error) {
    console.error(error)
  }
}

module.exports = { dbConnection }
