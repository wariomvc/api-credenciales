import { Router } from 'express';
import { check } from 'express-validator';

import { sendMailAvisoRegistro, sendMailGetCredencial } from '../controllers/email.controller';
const router = Router();

router.get(
  '/:id',
  check('id').isNumeric().withMessage('Error Request: El parametro id debe ser un numero'),
  sendMailAvisoRegistro,
);
router.get(
  '/credencial/:id',
  check('id').isNumeric().withMessage('Error Request: El parametro id debe ser un numero'),
  sendMailGetCredencial,
);
  

export default router;
