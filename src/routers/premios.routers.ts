import { Router } from 'express';
import { body, check } from 'express-validator';
import { getAllPremios, postPremio } from '../controllers/premios.controller';
const router = Router();
router.get(
  '/:id',
  check('id').isNumeric().withMessage('Parametro id debe ser numerico'),
  getAllPremios,
);
router.post(
  '/:id',
  [check('id').isNumeric().withMessage('Parametro id deb ser numerico')],
  postPremio,
);
export default router;
