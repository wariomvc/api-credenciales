import { Router } from 'express';
import { deleteUser, getAllUsers, postUser } from '../controllers/usuarios.controller';

const router = Router();
router.get('/', getAllUsers);
router.post('/', postUser);
router.delete('/:id', deleteUser);
export default router;
