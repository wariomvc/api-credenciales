import { Request, Response } from 'express';
import Premio from '../models/Premio';

export const getPremios = async (req: Request, res: Response) => {
  const idCliente = req.params.id;
  const premios = Premio.findByPk(idCliente);
};
