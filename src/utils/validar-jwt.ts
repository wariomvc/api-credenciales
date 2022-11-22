import { Response, Request, NextFunction } from 'express'; //Impporta los objetos de las peticiones
import * as jwt from 'jsonwebtoken';

export const validarJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-token');
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
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: error,
    });
  }

  next();
};
