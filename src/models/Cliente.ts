import { DataTypes } from 'sequelize';

import db from '../utils/database/connection';

const Cliente = db.define(
  'Cliente',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    apellido: { type: DataTypes.STRING, allowNull: false },
    nacimiento: { type: DataTypes.STRING, allowNull: false },
    tutor: { type: DataTypes.STRING, allowNull: false },
    escuela: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.STRING },
    nivel: { type: DataTypes.ENUM('Kinder', 'Primaria', 'Secundaria') },
    colonia: { type: DataTypes.STRING },
    foto: { type: DataTypes.STRING },
    codigo: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    email: { type: DataTypes.STRING, allowNull: false },
    locutor: { type: DataTypes.ENUM('Andres Oviedo', 'Deliz Guerrero', 'Jas Herrera') },
  },
  {
    paranoid: true,
  },
);

Cliente.sync().then(() => {
  console.log('Modelo Cliente Sincronizado');
});
export default Cliente;
