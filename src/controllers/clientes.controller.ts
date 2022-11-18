import { randomInt } from 'crypto';
import { Response, Request } from 'express'; //Impporta los objetos de las peticiones

import { UploadedFile } from 'express-fileupload';
import { validationResult } from 'express-validator';
import { PDFDocument, PDFFont, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs/promises';

import Cliente from '../models/Cliente'; //Importa el modelo de Cliente para el maneja de la tabla
import { Op, Sequelize } from 'sequelize';

export const generateCredencial = async (req: Request, res: Response) => {
  const cliente = await Cliente.findOne({ where: { codigo: 2098 } });
  const pdfDoc = await PDFDocument.create();
  const file = await fs.readFile(`src/credencial.jpeg`);
  const imgClienteFile = await fs.readFile(`src/upload/${cliente?.getDataValue('foto')}`);

  const page = pdfDoc.addPage([418, 682]);

  // Embed the Times Roman font
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Courier);

  page.setFont(timesRomanFont);

  // Add a blank page to the document

  // Get the width and height of the page
  //const { width, height } = page.getSize();
  //
  const imgCliente = await pdfDoc.embedJpg(imgClienteFile);

  const jpgImage = await pdfDoc.embedJpg(file);
  const jpgDims = jpgImage.scale(1);
  // Draw a string of text toward the top of the page
  page.drawImage(jpgImage, {
    x: 0,
    y: 2,
    width: jpgDims.width,
    height: jpgDims.height,
  });
  page.drawImage(imgCliente, {
    x: 110,
    y: 385,
    width: 190,
    height: 250,
  });
  let ancho = timesRomanFont.widthOfTextAtSize(
    cliente?.getDataValue('nombre') + ' ' + cliente?.getDataValue('apellido'),
    28,
  );
  page.drawText(cliente?.getDataValue('nombre') + ' ' + cliente?.getDataValue('apellido'), {
    x: 209 - ancho / 2,
    y: 355,
    font: timesRomanFont,
    size: 30,
    color: rgb(0, 0, 0),
    lineHeight: 24,
    opacity: 1,
  });
  ancho = timesRomanFont.widthOfTextAtSize(cliente?.getDataValue('escuela'), 28);
  page.drawText(cliente?.getDataValue('escuela'), {
    x: 209 - ancho / 2,
    y: 315,
    font: timesRomanFont,
    size: 28,
    color: rgb(0, 0, 0),
    lineHeight: 24,
    opacity: 1,
  });
  ancho = timesRomanFont.widthOfTextAtSize(cliente?.getDataValue('codigo').toString(), 28);
  page.drawText(cliente?.getDataValue('codigo').toString(), {
    x: 209 - ancho / 2,
    y: 276,
    font: timesRomanFont,
    size: 28,
    color: rgb(0, 0, 0),
    lineHeight: 24,
    opacity: 1,
  });
  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  fs.writeFile('nuevo.pdf', pdfBytes);
  return res.send();
};
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

export const getTopCodigo = async (_req: Request, res: Response) => {
  const numeroRegistros = await Cliente.max('codigo');
  return res.json({
    status: 200,
    msg: 'getNumRegistros',
    data: numeroRegistros,
  });
};

export const getAllClientes = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const textToFind = String(req.query.find || '');
  console.log(textToFind);
  const { skip, limit } = pagination(page);
  console.log(skip, limit);
  //let limit = Number(req.query.limit);
  if (limit) {
    const clientes = await Cliente.findAll({
      where: Sequelize.or(
        [{ codigo: { [Op.substring]: textToFind } }],
        [{ nombre: { [Op.substring]: textToFind } }],
      ),
      offset: skip,
      limit,
    });
    /* const clientes = await Cliente.findAll({
      where: Sequelize.or(
        [{ codigo: { [Op.substring]: textToFind } }],
        [{ nombre: { [Op.substring]: textToFind } }],
      ),
    }); */
    const countClientes = await Cliente.count({
      where: Sequelize.or(
        [{ codigo: { [Op.substring]: textToFind } }],
        [{ nombre: { [Op.substring]: textToFind } }],
      ),
    });
    return res.json({
      status: 200,
      msg: 'GetAllClientes',
      data: clientes,
      total: countClientes,
    });
  } else {
    const clientes = await Cliente.findAll();
    return res.json({
      status: 200,
      msg: 'GetAllClientes',
      data: clientes,
    });
  }
};

const pagination = (page: number) => {
  const PAGE_SIZE = 20;
  const skip = (page - 1) * PAGE_SIZE;
  return { skip, limit: PAGE_SIZE };
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

export const findByText = async (req: Request, res: Response) => {
  const textToFind = req.params.text;
  const clientes = await Cliente.findAll({
    where: Sequelize.or(
      [{ codigo: { [Op.substring]: textToFind } }],
      [{ nombre: { [Op.substring]: textToFind } }],
    ),
  });
  console.log(clientes);
  res.json({
    status: 200,
    msg: 'Resultado de buscar ' + textToFind,
    data: clientes,
  });
};

const getFileExtension = (filename: string) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};