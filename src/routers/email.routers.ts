import { Router } from 'express';
import { check } from 'express-validator';

import {
  exportXLSX,
  sendMailAvisoRegistro,
  sendMailGetCredencial,
} from '../controllers/email.controller';
const router = Router();

router.get(
  '/:id',
  check('id').isNumeric().withMessage('Error Request: El parametro id debe ser un numero'),
  sendMailAvisoRegistro,
);
router.post(
  '/credencial',
  check('id').isNumeric().withMessage('Error Request: El parametro id debe ser un numero'),
  sendMailGetCredencial,
);
router.post(
  '/excel',

  exportXLSX,
);
  
  

export default router;
