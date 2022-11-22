import { Router } from 'express';
import { body, check } from 'express-validator';
import { login } from '../controllers/auth.controller';
const router = Router();
router.get('/login', login);

export default router;
