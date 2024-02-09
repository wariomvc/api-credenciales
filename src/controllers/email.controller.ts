import { Response, Request } from 'express'; //Impporta los objetos de las peticiones
import nodemailer from 'nodemailer';
import { templateRegistro, templateGetCredencial } from '../utils/email/email.template';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { validationResult } from 'express-validator';
import { PDFDocument, PDFFont, StandardFonts, rgb, PDFImage } from 'pdf-lib';
import * as XLSX from 'xlsx';

import fs from 'fs/promises';
import zip from 'adm-zip';
import Cliente from '../models/Cliente'; //Importa el modelo de Cliente para el maneja de la tabla
import { Op, Sequelize } from 'sequelize';
import {
  generarMailGetCredencial,
  generarMailRegistro,
  initServerMail,
  loadEmailInfo,
} from '../utils/email/email.utils';
import { rmSync } from 'fs';
import Database from '../utils/database/config';
import { verifyOrCreateDir } from '../utils/utils.funcionts';
import path from 'path';

const pathExcelFile = 'src/assets/cred';
const mailAssetsDir = path.join(__dirname, '../../assets');

export const exportXLSX = async (req: Request, res: Response) => {
  console.log('Exportando');
  const workbook = XLSX.utils.book_new();
  const clientes = await Cliente.findAll();
  console.log(clientes.values());
  const dataClientes = [];
  for (const cliente of clientes.values()) {
    dataClientes.push(cliente.dataValues);
  }
  const worksheet = XLSX.utils.json_to_sheet(dataClientes);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Credenciales');
  console.log('Agrenado');
  /* create an XLSX file and try to save to Presidents.xlsx */
  try {
    XLSX.writeFileXLSX(workbook, `${pathExcelFile}/ListaCredenciales.xlsx`, { compression: true });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      msg: 'Error al escribir el archivo excel',
      data: {},
    });
  }
  return res.download(`${pathExcelFile}/ListaCredenciales.xlsx`, (err) => {
    if (!res.headersSent) {
      res.status(500).json({
        status: 500,
        msg: 'Error al descargar el archivo',
        data: err,
      });
    }
  });
};

export const PruebaAvisoRegistro = async (req: Request, res: Response) => {
  const cliente = await Cliente.findByPk(req.params.id);
  const transport = initServerMail();
  const message = generarMailRegistro(
    cliente?.getDataValue('email'),
    cliente?.getDataValue('nombre'),
    cliente?.getDataValue('apellido'),
    cliente?.getDataValue('codigo'),
  );
  transport.sendMail(message, function (error, info) {
    if (error) {
      console.log('Correo No Enviado:', error);
      return res.json(false);
    } else {
      console.log('Email sent: ' + info.response + message.to);
      return res.json(true);
    }
  });
};

export const sendMailAvisoRegistro = async (id: number) => {
  const cliente = await Cliente.findByPk(id);
  const transport = initServerMail();
  const message = generarMailRegistro(
    cliente?.getDataValue('email'),
    cliente?.getDataValue('nombre'),
    cliente?.getDataValue('apellido'),
    cliente?.getDataValue('codigo'),
  );
  transport.sendMail(message, function (error, info) {
    if (error) {
      console.log('Correo No Enviado:', error);
      return false;
    } else {
      console.log('Email sent: ' + info.response + message.to);
      return true;
    }
  });
};
export const test = async (req: Request, res: Response) => {
  const transport = initServerMail();
  const a = await transport.sendMail(
    {
      from: 'promociones@digitalradio.mx',
      to: 'wario.mvc@gmail.com',
      text: 'Esta es una prueba',
      subject: 'Prueba de nodemailer',
    },
    (error, info) => {
      if (error) console.log(error);
      else {
        console.log(info);
      }
    },
  );
  res.json(a);
};
export const sendMailGetCredencial = async (req: Request, res: Response) => {
  const apellido = req.body.apellido;
  const telefono = req.body.telefono;

  const cliente = await Cliente.findOne({ where: { apellido: apellido, telefono: telefono } });
  console.log(cliente);
  if (cliente === null) {
    console.log('No se encuentra el cliente');
    return res.status(404).json({
      status: 404,
      msg: 'No se encuentra el cliente',
      data: { apellido, telefono },
    });
  }
  const transport = initServerMail();
  console.log('Servidor Iniciado');
  const message = generarMailGetCredencial(
    cliente?.getDataValue('email'),
    cliente?.getDataValue('nombre'),
    cliente?.getDataValue('apellido'),
    cliente?.getDataValue('codigo'),
  );
  console.log('Mensaje generado');
  transport.sendMail(message, function (error, info) {
    if (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        msg: 'Error al enviar email',
        data: error,
      });
    } else {
      console.log('Email sent: ' + info.response);
      return res.json({
        status: 200,
        msg: 'Email enviado',
        data: {},
      });
    }
  });
};

interface Email {
  asunto: string;
  cuerpo: string;
  filename?: string;
}

export const loadEmailData = async (req: Request, res: Response) => {
  const data = loadEmailInfo();
  return res.json(data);
};
export const updateEmailInfo = async (req: Request, res: Response) => {
  let image: UploadedFile;
  if (req.files != undefined) {
    image = req.files.file as UploadedFile;
    verifyOrCreateDir(mailAssetsDir);
    await image.mv(path.join(mailAssetsDir, 'logo.jpg'));
  }

  const data: Email = { asunto: req.body['asunto'], cuerpo: req.body['cuerpo'] };

  await fs.writeFile(path.join(mailAssetsDir, 'emailinfo.json'), JSON.stringify(data), 'utf8');
  return res.json(data);
};