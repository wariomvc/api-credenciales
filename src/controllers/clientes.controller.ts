import { Response, Request } from 'express';

export const getAllClientes = (req: Request, res: Response) => {
  res.json({
    msg: 'GetAllClientes',
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
