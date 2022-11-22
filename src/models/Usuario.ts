import { DataTypes } from 'sequelize';

import db from '../utils/database/connection';

const Usuario = db.define(
  'Usuario',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    paranoid: true,
  },
);

export default Usuario;
