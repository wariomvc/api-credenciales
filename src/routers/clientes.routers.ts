import { Router } from 'express';
import { body, check } from 'express-validator';
import { validarLogin } from '../controllers/auth.controller';
import {
  deleteCliente,
  getAllClientes,
  getOneCliente,
  postCliente,
  putCliente,
  uploadFoto,
  getOneClienteByCodigo,
  getFoto,
  getTopCodigo,
  findByText,
  getCredencial,
  getMultiCredencial,
  getCredencialImage,
  getRecuperacionActivada,
  postToggleRecuperacion,
  getEscuelas,
  getOneClientByEmail,
  setImpresas,
} from '../controllers/clientes.controller';
import { validarJWT } from '../utils/validar-jwt';
const router = Router();

router.get('/config', getRecuperacionActivada);
router.post('/config', validarJWT, postToggleRecuperacion);
router.post('/upload', uploadFoto);
router.get('/escuelas', getEscuelas);
router.get('/credencial/png/:codigo', validarJWT, getCredencialImage);
router.get('/credencial/:codigo', validarJWT, getCredencial);

router.post('/credencial/', validarJWT, getMultiCredencial);
router.get('/top', getTopCodigo);
router.get('/', validarJWT, getAllClientes);
router.get('/find/:text', validarJWT, findByText);
router.get(
  '/:id',
  check('id').isNumeric().withMessage('Error: parametro id, debe ser númerico.'),
  validarJWT,
  getOneCliente,
);
router.get(
  '/codigo/:codigo',
  check('codigo').isNumeric().withMessage('Error: parametro id, debe ser númerico.'),
  validarJWT,
  getOneClienteByCodigo,
);
router.post(
  '/info',
  body('email')
    .notEmpty()
    .withMessage('error. NO existe el campo email')
    .isEmail()
    .withMessage('No tiene formato de email'),
  getOneClientByEmail,
);
router.post('/impresas', setImpresas);
router.get(
  '/foto/:codigo',
  check('codigo').isNumeric().withMessage('Error: parametro id, debe ser númerico.'),
  validarJWT,
  getFoto,
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

    body('nivel')
      .isIn(['Kinder', 'Primaria', 'Secundaria'])
      .withMessage('El parametro nivel solo acepta los valores Kinder, Primaria y Secundaria'),
    body('codigo').isInt({ min: 1000 }).withMessage('El parametro codigo debe ser minimo de 1000'),
  ],
  postCliente,
);
router.put(
  '/:id',
  [
    check('id').isNumeric().withMessage('Error: parametro id, debe ser númerico.'),
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
  validarJWT,
  putCliente,
);
router.delete(
  '/:id',
  check('id').isNumeric().withMessage('Error: parametro id, debe ser númerico.'),
  validarJWT,
  deleteCliente,
);

export default router;
