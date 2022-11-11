import { Router } from 'express';
import {
  deleteCliente,
  getAllClientes,
  getOneCliente,
  postCliente,
  putCliente,
} from '../controllers/clientes.controller';
const router = Router();

router.get('/', getAllClientes);
router.get('/:id', getOneCliente);
router.post('/', postCliente);
router.put('/:id', putCliente);
router.delete('/:id', deleteCliente);

export default router;
