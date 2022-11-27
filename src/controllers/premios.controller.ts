import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Cliente from '../models/Cliente';
import Premio from '../models/Premio';

export const getAllPremios = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(404).json({
      status: 404,
      msg: 'Error en la petición',
      data: errors.mapped(),
    });
  }
  const idCliente = req.params.id;
  const clienteDB = await Cliente.findOne({ where: { codigo: idCliente }, include: Premio });
  console.log(clienteDB);
  if (clienteDB == null) {
    return res.status(404).json({
      statud: 404,
      msg: `No se encontró el Cliente con el id ${idCliente}`,
    });
  }
  res.json({
    status: 200,
    msg: `Lista de premios del clinete id:${idCliente}`,
    data: clienteDB.getDataValue('Premios'),
  });
};

export const deletePremio = async (req: Request, res: Response) => {
  const premioId = req.params.id;
  Premio.destroy({ where: { id: premioId } });
  res.json({
    status: 200,
    msg: `Premio ${premioId} ha sido borrado`,
    data: {},
  });
};
export const postPremio = async (req: Request, res: Response) => {
  console.log(req.body);
  const clienteId = req.params.id;
  const cliente = await Cliente.findOne({ where: { codigo: clienteId } });
  const newPremio = await Premio.create(req.body);
  newPremio.setDataValue('ClienteId', cliente?.getDataValue('id'));
  newPremio.save();
  console.log('CLIENTE ***', cliente);
  res.json({
    status: 200,
    msg: 'Se agrego premio',
    data: newPremio,
  });
};