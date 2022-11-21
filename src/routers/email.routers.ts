import { Router } from 'express';
import { check } from 'express-validator';

import { sendMailAvisoRegistro } from '../controllers/email.controller';
const router = Router();

router.get(
  '/:id',
  check('id').isNumeric().withMessage('Error Request: El parametro id debe ser un numero'),
  sendMailAvisoRegistro,
);

export default router;
