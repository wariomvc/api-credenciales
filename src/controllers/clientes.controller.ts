import { randomInt } from 'crypto';
import { Response, Request } from 'express'; //Impporta los objetos de las peticiones


import { UploadedFile } from 'express-fileupload';
import { validationResult } from 'express-validator';
import { PDFDocument, StandardFonts, rgb, PDFImage, cleanText } from 'pdf-lib';
import { pdfToPng, PngPageOutput } from 'pdf-to-png-converter';
import dotenv from 'dotenv';

import fs from 'fs/promises';
import zip from 'adm-zip';
import Cliente from '../models/Cliente'; //Importa el modelo de Cliente para el maneja de la tabla
import { Op, Sequelize, where } from 'sequelize';
import { Stats } from 'fs';
import { sendMailAvisoRegistro } from './email.controller';
import { generarMailImpresion, initServerMail } from '../utils/email/email.utils';
import { templateImpresion } from '../utils/email/email.template';

dotenv.config();
const path = {
  credenciales: `${process.env.BASEURL}/assets/cred/`,
  upload: `${process.env.BASEURL}/upload/`,
  template: `${process.env.BASEURL}/assets/`,
  placeholderFoto: `${process.env.BASEURL}/assets/placeholder.jpg`,
  configFile: `${process.env.BASEURL}/assets/config.json`,
};

export const getEscuelas = async (req: Request, res: Response) => {
  const escuelas = await Cliente.findAll({ attributes: ['escuela'], group: 'escuela' });

  const lista = escuelas.map((escuela) => {
    return escuela.getDataValue('escuela');
  });
  return res.json({
    status: 200,
    data: lista,
  });
};
export const getRecuperacionActivada = async (req: Request, res: Response) => {
  const configFile = await fs.readFile(path.configFile);

  const jsonConfig = configFile.toString('utf8');
  const config = JSON.parse(jsonConfig);
  res.json({
    status: 200,
    msg: 'Configuracion de recuperacion de cred',
    data: config,
  });
};

export const postToggleRecuperacion = async (req: Request, res: Response) => {
  const configFile = await fs.readFile(path.configFile);
  const jsonConfig = configFile.toString('utf8');
  const config = JSON.parse(jsonConfig);
  console.log(config);

  config.recuperacion = !config.recuperacion;
  console.log(config);
  //const config = { recuperacion: }
  await fs.writeFile(path.configFile, JSON.stringify(config, null, 2));

  //const ajsonConfig = configFile.toString('utf8');
  //const config = JSON.parse(jsonConfig);
  res.json({
    status: 200,
    msg: 'Configuracion de recuperacion de cred',
    data: config,
  });
};

export const getMultiCredencial = async (req: Request, res: Response) => {
  console.log('GetmUltiCredencial');
  console.log(req.body);
  const listCredenciales = req.body.list as number[];
  console.log(listCredenciales.length);
  if (listCredenciales.length === 0) {
    const codigos = await Cliente.findAll({ attributes: ['codigo'] });
    codigos.forEach((codigo) => {
      listCredenciales.push(codigo.getDataValue('codigo'));
    });
  }
  const filePackCredencialPack = new zip();
  for (const codigo of listCredenciales) {
    await addZip(filePackCredencialPack, codigo);
  }
  await filePackCredencialPack.writeZipPromise(`${path.credenciales}pack.zip`, {
    overwrite: true,
  });
  return res.download(`${path.credenciales}pack.zip`, `credenciales.zip`, (error) => {
    res.end();
  });
};
const addZip = async (zipFile: zip, codigo: number) => {
  console.log('Codigo:', codigo);
  await generateCredencial(codigo);
  zipFile.addLocalFile(`${path.credenciales}${codigo}.pdf`);
  console.log(`${path.credenciales}${codigo}.pdf`);
  console.log('Archivo agregado');
};

export const getCredencialImage = async (req: Request, res: Response) => {
  console.log('getCredencialImage');
  const codigoCredencial = req.params.codigo;
  /* try {
    await fs.stat(`${path.credenciales}${codigoCredencial}.pdf`);
  } catch (e) {
    console.log('INFO: ', e);
    await generateCredencial(parseInt(codigoCredencial));
  } */
  await generateCredencial(parseInt(codigoCredencial));
  console.log('çonvirtiendo pdf to png');
  await convertPDftoPNG(`${path.credenciales}${codigoCredencial}.pdf`, `${codigoCredencial}`);
  console.log('Downloading Credencial');

  return res.download(
    `${path.credenciales}${codigoCredencial}_page_1.png`,
    `credencial.png`,
    (error) => {
      console.log('Descargado');
      //res.end();
    },
  );
};

export const getCredencial = async (req: Request, res: Response) => {
  console.log('get');
  const codigoCredencial = req.params.codigo;
  try {
    await fs.stat(`${path.credenciales}${codigoCredencial}.pdf`);
  } catch (e) {
    console.log('INFO: ', e);
    await generateCredencial(parseInt(codigoCredencial));
  }
  if (!(await generateCredencial(parseInt(codigoCredencial)))) {
    console.log('No se pudó generar la credencial');
    res.status(404).json({
      status: 404,
      msg: 'No fue posible generar la credencial',
      data: {},
    });
  }
  console.log('Downloading Credencial');
  return res.download(
    `${path.credenciales}${codigoCredencial}.pdf`,
    `credencial_${codigoCredencial}.pdf`,
    (error) => {
      console.log('Error', error);
    },
  );
};

export const generateCredencial = async (codigo: number) => {
  console.log('Generando Credencial----------------');
  try {
    const cliente = await Cliente.findOne({ where: { codigo: codigo } });
    const pdfDoc = await PDFDocument.create();
    const templateFront = await fs.readFile(`${path.template}credencialx2.png`);
    const templateBack = await fs.readFile(`${path.template}credencial_back.jpeg`);
    let imgClienteFile: Buffer | undefined;
    console.log('Revisando Arhcivo');
    let existFile: Stats | undefined;
    try {
      existFile = await fs.stat(`${path.upload}${cliente?.getDataValue('foto')}`);
    } catch (error) {
      console.log(error);
    }

    let extensionImage = '';
    console.log('Existe ARCHIVO', existFile);
    if (existFile === undefined) {
      console.log('No Existio la Foto');
      imgClienteFile = await fs.readFile(path.placeholderFoto);
      extensionImage = getFileExtension(`${path.upload}${cliente?.getDataValue('foto')}`);
    } else {
      extensionImage = getFileExtension(path.placeholderFoto);
      if (extensionImage != 'jpeg' && extensionImage != 'jpg' && extensionImage != 'png') {
        console.log('Se uso placehoder');
        imgClienteFile = await fs.readFile(path.placeholderFoto);
        extensionImage = getFileExtension(path.placeholderFoto);
      } else {
        imgClienteFile = await fs.readFile(`${path.upload}${cliente?.getDataValue('foto')}`);
        extensionImage = getFileExtension(`${path.upload}${cliente?.getDataValue('foto')}`);
      }
    }

    const pageOne = pdfDoc.addPage([826, 1358]);
    console.log('Archivos cargados');
    // Embed the Times Roman font
    const courierFont = await pdfDoc.embedFont(StandardFonts.CourierBold);

    pageOne.setFont(courierFont);

    // Add a blank pageOne to the document

    // Get the width and height of the pageOne
    //const { width, height } = pageOne.getSize();
    let imgCliente: PDFImage;
    console.log(extensionImage);
    if (
      extensionImage === 'jpeg' ||
      extensionImage === 'jpg' ||
      extensionImage === 'JPG' ||
      extensionImage === 'JPEG'
    ) {
      console.log('Foto tipo jpg');
      imgCliente = await pdfDoc.embedJpg(imgClienteFile);
    } else if (extensionImage === 'png' || extensionImage === 'PNG') {
      console.log('Foto tipo png');
      imgCliente = await pdfDoc.embedPng(imgClienteFile);
    } else {
      console.log('Usado Place Holder NO se encontro la foto');

      imgCliente = await pdfDoc.embedPng(path.placeholderFoto);
    }
    //imgCliente = await pdfDoc.embedPng(path.placeholderFoto);
    console.log('Continuo la ejecucion');
    const jpgImageFront = await pdfDoc.embedPng(templateFront);
    const jpgDims = jpgImageFront.scale(1);
    // Draw a string of text toward the top of the pageOne
    pageOne.drawImage(imgCliente, {
      x: 260,
      y: 832,
      width: 310,
      height: 380,
    });
    pageOne.drawImage(jpgImageFront, {
      x: 1,
      y: 0,
      width: jpgDims.width + 1,
      height: jpgDims.height,
    });
    const nombre_completo =
      cliente?.getDataValue('nombre') + ' ' + cliente?.getDataValue('apellido');
    let ancho = 0;
    let sizeFont = 40;
    do {
      console.log(ancho, sizeFont);
      ancho = courierFont.widthOfTextAtSize(nombre_completo, sizeFont);
      sizeFont--;
    } while (ancho > 710);

    pageOne.drawText(cliente?.getDataValue('nombre') + ' ' + cliente?.getDataValue('apellido'), {
      x: 432 - ancho / 2,
      y: 710,
      font: courierFont,
      size: sizeFont,
      color: rgb(0, 0, 0),
      lineHeight: 24,
      opacity: 1,
    });
    const nacimiento = new Date(cliente?.getDataValue('nacimiento'));
    const txtNacimiento = nacimiento.toLocaleDateString('es-ES', {
      year: 'numeric',
      day: 'numeric',
      month: 'short',
    });
    pageOne.drawText('Cumpleaños', {
      x: 320,
      y: 660,
      font: courierFont,
      size: 32,
      color: rgb(0, 0, 0),
      lineHeight: 24,
      opacity: 1,
    });
    ancho = courierFont.widthOfTextAtSize(txtNacimiento, 40);
    pageOne.drawText(txtNacimiento, {
      x: 412 - ancho / 2,
      y: 620,
      font: courierFont,
      size: 40,
      color: rgb(0, 0, 0),
      lineHeight: 24,
      opacity: 1,
    });
    ancho = courierFont.widthOfTextAtSize(cliente?.getDataValue('codigo').toString(), 40);
    pageOne.drawText('Clave:', {
      x: 200,
      y: 540,
      font: courierFont,
      size: 36,
      color: rgb(0, 0, 0),
      lineHeight: 32,
      opacity: 1,
    });
    pageOne.drawText(cliente?.getDataValue('codigo').toString(), {
      x: 480 - ancho / 2,
      y: 540,
      font: courierFont,
      size: 40,
      color: rgb(0, 0, 0),
      lineHeight: 24,
      opacity: 1,
    });
    const pageTwo = pdfDoc.addPage([826, 1358]);
    pageTwo.setFont(courierFont);
    const jpgImageBack = await pdfDoc.embedJpg(templateBack);
    const jpgDimsBack = jpgImageBack.scale(1);
    pageTwo.drawImage(jpgImageBack, {
      x: +1,
      y: 0,
      width: jpgDimsBack.width + 1,
      height: jpgDimsBack.height,
    });
    console.log(pdfDoc.getPageCount());
    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    try {
      await fs.writeFile(`${path.credenciales}${codigo}.pdf`, pdfBytes);
    } catch (error) {
      console.log(error);
      return false;
    }
    console.log('Credencial Generada true');
    return true;
  } catch (error) {
    console.log('Credencial no generada', error);
    return false;
  }
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
    console.log('FOTO SUBIDA:', uploadedFoto);
    if (
      uploadedFoto.size <= 0 ||
      (uploadedFoto.mimetype != 'image/png' && uploadedFoto.mimetype != 'image/jpeg')
    ) {
      return res.status(415).json({
        status: 415,
        msg: 'El archivo es de tipo incorrecto, solo se permiten imagenes',
      });
    }
    console.log('NOMBRE', uploadedFoto.name);
    console.log('Extension', getFileExtension(uploadedFoto.name));
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
  const numeroRegistros = await Cliente.max('codigo', { paranoid: false });
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
export const setImpresas = async (req: Request, res: Response) => {
  const listCredenciales = req.body.list as number[];
  console.log(listCredenciales);
  const clientes = await Cliente.findAll({ where: { codigo: listCredenciales } });
  const transport = initServerMail();
  clientes.forEach((cliente) => {
    const message = generarMailImpresion(
      cliente.getDataValue('email'),
      cliente.getDataValue('nombre'),
      cliente.getDataValue('apellido'),
      cliente.getDataValue('codigo'),
    );
    console.log('EMAIL:', cliente.getDataValue('email'));
    transport.sendMail(message, function (error, info) {
      if (error) {
        console.log('Correo No Enviado:', error);
        return false;
      } else {
        console.log('Email sent: ' + JSON.stringify(info));
        return true;
      }
    });
  });
  const updated = await Cliente.update({ generado: true }, { where: { codigo: listCredenciales } });
  console.log(updated);
  return res.json(updated);
};
export const getOneClientByEmail = async (req: Request, res: Response) => {
  console.log('GetOneClientByEmail');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      msg: 'Errores en la validación de la peticion',
      errors: errors.mapped(),
    });
  }
  const data = req.body;
  console.log(data.email);
  const cliente = await Cliente.findOne({ where: { email: data.email } });
  if (cliente === null) {
    return res.status(404).json({ msg: 'Error: No se encontro el cliente' });
  }

  return res.json(cliente);
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
  const email_enviado = sendMailAvisoRegistro(nuevoCliente.getDataValue('id'));
  return res.json({
    status: 200,
    msg: `postCliente ${email_enviado}`,
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
    if (!res.headersSent) {
      console.log('Header Enviado');
      return res.json({
        status: 200,
        msg: 'Imagen descargada',
      });
    } else {
      if (error)
        return res.status(500).json({
          status: 500,
          msg: 'Occurió un error al descargar la imagen',
          data: error,
        });
    }
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

const convertPDftoPNG = async (pdfFilePath: string, filename: string) => {
  const pngPages: PngPageOutput[] = await pdfToPng(
    pdfFilePath, // The function accepts PDF file path or a Buffer
    {
      disableFontFace: false, // When `false`, fonts will be rendered using a built-in font renderer that constructs the glyphs with primitive path commands. Default value is true.
      useSystemFonts: false, // When `true`, fonts that aren't embedded in the PDF document will fallback to a system font. Default value is false.
      viewportScale: 1.0, // The desired scale of PNG viewport. Default value is 1.0.
      outputFolder: path.credenciales, // Folder to write output PNG files. If not specified, PNG output will be available only as a Buffer content, without saving to a file.
      outputFileMask: filename, // Output filename mask. Default value is 'buffer'.
      pdfFilePassword: '', // Password for encrypted PDF.
      pagesToProcess: [1], // Subset of pages to convert (first page = 1), other pages will be skipped if specified.
      strictPagesToProcess: false, // When `true`, will throw an error if specified page number in pagesToProcess is invalid, otherwise will skip invalid page. Default value is false.
      verbosityLevel: 1, // Verbosity level. ERRORS: 0, WARNINGS: 1, INFOS: 5. Default value is 0.
    },
  );
  return pngPages;
};