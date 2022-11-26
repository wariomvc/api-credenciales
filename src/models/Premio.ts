import { DataTypes } from 'sequelize';

import db from '../utils/database/connection';
import Cliente from './Cliente';

const Premio = db.define(
  'Premio',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    premio: { type: DataTypes.STRING, allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false },
  },
  {
    paranoid: true,
  },
);

export default Premio;
