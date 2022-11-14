import { Response, Request } from 'express';

import Cliente from '../models/Cliente';

export const getAllClientes = async (req: Request, res: Response) => {
  const clientes = await Cliente.findAll();
  res.json({
    msg: 'GetAllClientes',
    data: clientes,
  });
};

export const getOneCliente = (req: Request, res: Response) => {
  res.json({
    msg: 'GetOneCliente',
  });
};

export const postCliente = (req: Request, res: Response) => {
  res.json({
    msg: 'postCliente',
  });
};
export const putCliente = (req: Request, res: Response) => {
  res.json({
    msg: 'putCliente',
  });
};

export const deleteCliente = (req: Request, res: Response) => {
  res.json({
    msg: 'deleteCliente',
  });
};
