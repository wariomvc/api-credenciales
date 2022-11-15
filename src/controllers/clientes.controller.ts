import { Response, Request } from 'express'; //Impporta los objetos de las peticiones
import { validationResult } from 'express-validator';

import Cliente from '../models/Cliente'; //Importa el modelo de Cliente para el maneja de la tabla

export const getNumRegistros = async (_req: Request, res: Response) => {
  const numeroRegistros = await Cliente.count();
  return res.json({
    msg: 'getNumRegistros',
    data: numeroRegistros,
  });
};

export const getAllClientes = async (_req: Request, res: Response) => {
  const clientes = await Cliente.findAll();
  return res.json({
    msg: 'GetAllClientes',
    data: clientes,
  });
};

export const getOneCliente = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).json({
      errors: errors.mapped(),
    });
  }
  const idParamCliente = req.params.id;
  const cliente = await Cliente.findByPk(idParamCliente);

  if (cliente === null) {
    return res.status(404).json({
      msg: `No se encontró el Cliente con el id: ${idParamCliente}`,
    });
  }

  return res.json({
    msg: 'GetOneCliente',
    data: cliente,
  });
};

export const postCliente = async (req: Request, res: Response) => {
  console.log(req.body.email);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).json({
      errors: errors.mapped(),
    });
  }
  const data = req.body;
  const nuevoCliente = await Cliente.create(data);
  return res.json({
    msg: 'postCliente',
    data: nuevoCliente,
  });
};
export const putCliente = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).json({
      errors: errors.mapped(),
    });
  }
  const idParamCliente = req.params.id;
  const data = req.body;
  const clienteDB = await Cliente.findByPk(idParamCliente);
  if (clienteDB === null) {
    return res.status(404).json({
      msg: `No se encontró el cliente con el id: ${idParamCliente}`,
    });
  }
  await clienteDB.update(data);
  return res.json({
    msg: 'putCliente',
    data: clienteDB,
  });
};

export const deleteCliente = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).json({
      errors: errors.mapped(),
    });
  }
  const idParamCliente = req.params.id;
  const cliente = await Cliente.destroy({
    where: { id: idParamCliente },
  });
  res.json({
    msg: `${cliente} registros borrados`,
  });
};
