import { randomInt } from 'crypto';
import { Response, Request } from 'express'; //Impporta los objetos de las peticiones

import { UploadedFile } from 'express-fileupload';
import { validationResult } from 'express-validator';

import Cliente from '../models/Cliente'; //Importa el modelo de Cliente para el maneja de la tabla

export const uploadFoto = async (req: Request, res: Response) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      status: 400,
      msg: 'Errores en la validación de la peticion',
    });
  }

  try {
    const uploadedFoto = <UploadedFile>req.files.foto;
    if (
      uploadedFoto.size <= 0 ||
      (uploadedFoto.mimetype != 'image/png' && uploadedFoto.mimetype != 'image/jpeg')
    ) {
      return res.status(415).json({
        status: 415,
        msg: 'El archivo es de tipo incorrecto, solo se permiten imagenes',
      });
    }
    const nuevoNombreFoto =
      uploadedFoto.md5 + randomInt(1000).toString() + '.' + getFileExtension(uploadedFoto.name);

    const uploadPath = __dirname + '/../upload/' + nuevoNombreFoto;

    await uploadedFoto.mv(uploadPath);
    res.json({
      status: 200,
      msg: `El archivo ${uploadedFoto.name} fue cargado correctamente`,
      data: nuevoNombreFoto,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      msg: error,
    });
  }
};

export const getNumRegistros = async (_req: Request, res: Response) => {
  const numeroRegistros = await Cliente.count();
  return res.json({
    status: 200,
    msg: 'getNumRegistros',
    data: numeroRegistros,
  });
};

export const getAllClientes = async (_req: Request, res: Response) => {
  const clientes = await Cliente.findAll();
  return res.json({
    status: 200,
    msg: 'GetAllClientes',
    data: clientes,
  });
};

export const getOneCliente = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      msg: 'Errores en la validación de la peticion',
      errors: errors.mapped(),
    });
  }
  const idParamCliente = req.params.id;
  const cliente = await Cliente.findByPk(idParamCliente);

  if (cliente === null) {
    return res.status(404).json({
      status: 404,
      msg: `No se encontró el Cliente con el id: ${idParamCliente}`,
    });
  }

  return res.json({
    status: 200,
    msg: 'GetOneCliente',
    data: cliente,
  });
};
export const getOneClienteByCodigo = async (req: Request, res: Response) => {
  console.log('Entrando');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      msg: 'Errores en la validación de la peticion',
      errors: errors.mapped(),
    });
  }
  const codigoCliente = req.params.codigo;
  console.log(codigoCliente);
  const cliente = await Cliente.findOne({ where: { codigo: codigoCliente } });

  if (cliente === null) {
    return res.status(404).json({
      status: 404,
      msg: `No se encontró el Cliente con el id: ${codigoCliente}`,
    });
  }

  return res.json({
    status: 200,
    msg: 'GetOneCliente',
    data: cliente,
  });
};

export const postCliente = async (req: Request, res: Response) => {
  console.log(req.body.email);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      msg: 'Errores en la validación de la peticion',
      errors: errors.mapped(),
    });
  }
  const data = req.body;
  const nuevoCliente = await Cliente.create(data);
  return res.json({
    status: 200,
    msg: 'postCliente',
    data: nuevoCliente,
  });
};
export const putCliente = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      msg: 'Errores en la validación de la peticion',
      errors: errors.mapped(),
    });
  }
  const idParamCliente = req.params.id;
  const data = req.body;
  const clienteDB = await Cliente.findByPk(idParamCliente);
  if (clienteDB === null) {
    return res.status(404).json({
      status: 404,
      msg: `No se encontró el cliente con el id: ${idParamCliente}`,
    });
  }
  await clienteDB.update(data);
  return res.json({
    msg: 'putCliente',
    data: clienteDB,
  });
};

export const deleteCliente = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      msg: 'Errores en la validación de la peticion',
      errors: errors.mapped(),
    });
  }
  const idParamCliente = req.params.id;
  const cliente = await Cliente.destroy({
    where: { id: idParamCliente },
  });
  res.json({
    status: 200,
    msg: `${cliente} registros borrados`,
  });
};

export const getFoto = async (req: Request, res: Response) => {
  const idCodigoCliente = req.params.codigo;
  const clienteDB = await Cliente.findOne({ where: { codigo: idCodigoCliente } });
  console.log(clienteDB);
  const nameFoto = clienteDB?.getDataValue('foto');
  console.log(nameFoto);
  const pathFoto = __dirname + '/../upload/' + nameFoto;
  res.download(pathFoto, (error) => {
    if (error)
      return res.status(500).json({
        status: 500,
        msg: 'Occurió un error al descargar la imagen',
      });
  });
};

const getFileExtension = (filename: string) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};