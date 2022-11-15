import { Router } from 'express';
import { body, check } from 'express-validator';
import {
  deleteCliente,
  getAllClientes,
  getOneCliente,
  postCliente,
  putCliente,
  getNumRegistros,
  uploadFoto,
} from '../controllers/clientes.controller';
const router = Router();

router.post('/upload', uploadFoto);
router.get('/top', getNumRegistros);
router.get('/', getAllClientes);
router.get(
  '/:id',
  check('id').isNumeric().withMessage('Error: parametro id, debe ser númerico.'),
  getOneCliente,
);
router.post(
  '/',
  [
    body(['nombre', 'apellido', 'tutor', 'escuela', 'colonia', 'locutor'])
      .isLength({ min: 2 })
      .withMessage(
        'Los para metros de nombre, apellido, tutor, escuela, colonia, locutor deben tener al menos 3 caracteres',
      ),
    body('nacimiento').isDate().withMessage('El parametro nacimiento debe ser una fecha valida'),
    body('telefono').whitelist('123456789'),
    body('nivel')
      .isIn(['Kinder', 'Primaria', 'Secundaria'])
      .withMessage('El parametro nivel solo acepta los valores Kinder, Primaria y Secundaria'),
    body('codigo').isInt({ min: 1000 }).withMessage('El parametro codigo debe ser minimo de 1000'),
    body('email').trim().isEmail().normalizeEmail({
      gmail_lowercase: true,
      gmail_remove_dots: true,
      outlookdotcom_lowercase: true,
      outlookdotcom_remove_subaddress: true,
      yahoo_lowercase: true,
      yahoo_remove_subaddress: true,
      icloud_lowercase: true,
      icloud_remove_subaddress: true,
    }),
  ],
  postCliente,
);
router.put(
  '/:id',
  [
    check('id').isNumeric().withMessage('Error: parametro id, debe ser númerico.'),
    body(['nombre', 'apellido', 'tutor', 'escuela, colonia,locutor'])
      .isLength({ min: 2 })
      .withMessage(
        'Los para metros de nombre, apellido, tutor, escuela, colonia, locutor deben tener al menos 3 caracteres',
      ),
    body('nacimiento').isDate().withMessage('El parametro nacimiento debe ser una fecha valida'),
    body('telefono').whitelist('123456789'),
    body('nivel')
      .isIn(['Kinder', 'Primaria', 'Secundaria'])
      .withMessage('El parametro nivel solo acepta los valores Kinder, Primaria y Secundaria'),
    body('codigo').isInt({ min: 1000 }).withMessage('El parametro codigo debe ser minimo de 1000'),
    body('email').trim().isEmail().normalizeEmail({
      gmail_lowercase: true,
      gmail_remove_dots: true,
      outlookdotcom_lowercase: true,
      outlookdotcom_remove_subaddress: true,
      yahoo_lowercase: true,
      yahoo_remove_subaddress: true,
      icloud_lowercase: true,
      icloud_remove_subaddress: true,
    }),
  ],
  putCliente,
);
router.delete(
  '/:id',
  check('id').isNumeric().withMessage('Error: parametro id, debe ser númerico.'),
  deleteCliente,
);

export default router;
