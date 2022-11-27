import { Request, Response } from 'express';
import Usuario from '../models/Usuario';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req: Request, res: Response) => {
  const usuariosDB = await Usuario.findAll({ attributes: ['id', 'nombre'] });
  console.log('GetAllUsuarios', usuariosDB);
  res.json({
    status: 200,
    msg: 'Lista de Usuarios',
    data: usuariosDB,
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const idUsuario = req.params.id;
  await Usuario.destroy({ where: { id: idUsuario } });
  res.json({
    status: 200,
    msg: `Usuario ${idUsuario} borrado`,
    data: {},
  });
};

export const postUser = async (req: Request, res: Response) => {
  const { nombre, password } = req.body;

  const salt = bcrypt.genSaltSync();
  const passwordHashed = bcrypt.hashSync(password, salt);
  const usuario = await Usuario.create({ nombre: nombre, password: passwordHashed });

  res.json({
    status: 200,
    msg: 'Usuario Agregado',
    data: usuario,
  });
};
