import { Router } from 'express';
import { body, check } from 'express-validator';
import { login, validarLogin } from '../controllers/auth.controller';
const router = Router();
router.post('/login', login);
router.post('/valid', validarLogin);
export default router;
