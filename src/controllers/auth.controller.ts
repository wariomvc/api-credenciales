import { Response, Request } from 'express'; //Impporta los objetos de las peticiones

import bcrypt from 'bcryptjs';

import Usuario from '../models/Usuario';
import { generarJWT } from '../utils/jwt';
import * as jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  const { usuario, password } = req.body;
  console.log('Login de ', usuario + password);
  if (usuario === undefined || password === undefined) {
    return res.status(404).json({
      status: 404,
      msg: 'Los campos nomre o passworsd estan vacios',
    });
  }
  const salt = bcrypt.genSaltSync();
  console.log(bcrypt.hashSync(password, salt));
  try {
    const usuarioDB = await Usuario.findOne({ where: { nombre: usuario } });
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
export const validarLogin = async (req: Request, res: Response) => {
  const token = req.body.token;
  console.log(req.headers);
  if (!token) {
    return res.status(400).json({
      ok: false,
      msg: 'Error no hay un token en la cabecera',
    });
  }
  try {
    const uid = jwt.verify(token, process.env.JWT_KEY || '');
    console.log(uid);
    return res.json({
      status: 200,
      msd: 'Token Correcto',
      data: uid,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: error,
    });
  }
};