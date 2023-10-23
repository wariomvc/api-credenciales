import { Router } from 'express';
import { check } from 'express-validator';

import {
  PruebaAvisoRegistro,
  exportXLSX,
  sendMailAvisoRegistro,
  sendMailGetCredencial,
  updateEmailInfo,
} from '../controllers/email.controller';
const router = Router();

router.get('/excel', exportXLSX);

router.get(
  '/:id',
  check('id').isNumeric().withMessage('Error Request: El parametro id debe ser un numero'),
  PruebaAvisoRegistro,
);
router.post(
  '/credencial',
  check('id').isNumeric().withMessage('Error Request: El parametro id debe ser un numero'),
  sendMailGetCredencial,
);

router.post(
  '/update',
  check('asunto')
    .isAlphanumeric()
    .withMessage('Error Request: El parametro asunto debe ser un numero'),
  check('cuerpo')
    .isAlphanumeric()
    .withMessage('Error Request: El parametro cuerpo debe ser un numero'),
  updateEmailInfo,
);

  
  

export default router;
