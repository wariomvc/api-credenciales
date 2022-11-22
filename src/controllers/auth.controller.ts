import { Response, Request } from 'express'; //Impporta los objetos de las peticiones

import bcrypt from 'bcryptjs';

import Usuario from '../models/Usuario';
import { generarJWT } from '../utils/jwt';

export const login = async (req: Request, res: Response) => {
  const { nombre, password } = req.body;
  if (nombre === undefined || password === undefined) {
    return res.status(404).json({
      status: 404,
      msg: 'Los campos nomre o passworsd estan vacios',
    });
  }
  const salt = bcrypt.genSaltSync();
  console.log(bcrypt.hashSync(password, salt));
  try {
    const usuarioDB = await Usuario.findOne({ where: { nombre: nombre } });
    console.log(usuarioDB);
    if (!usuarioDB) {
      return res.status(401).json({
        ok: false,
        msg: 'No existe el usuario',
      });
    }

    const validPassword = bcrypt.compareSync(password, usuarioDB.getDataValue('password'));
    if (validPassword) {
      const token = await generarJWT(usuarioDB.getDataValue('nombre'));
      return res.status(200).json({
        ok: true,
        token,
        usuario: usuarioDB.getDataValue('nombre'),
      });
    } else {
      return res.status(401).json({
        ok: false,
        msg: 'No coincide el password',
      });
    }
  } catch (error) {
    console.log(error);
  }
};
