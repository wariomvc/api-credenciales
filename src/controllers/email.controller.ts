import { Response, Request } from 'express'; //Impporta los objetos de las peticiones
import nodemailer from 'nodemailer';
import { templateRegistro, templateGetCredencial } from '../utils/email/email.template';
import { UploadedFile } from 'express-fileupload';
import { validationResult } from 'express-validator';
import { PDFDocument, PDFFont, StandardFonts, rgb, PDFImage } from 'pdf-lib';

import fs from 'fs/promises';
import zip from 'adm-zip';
import Cliente from '../models/Cliente'; //Importa el modelo de Cliente para el maneja de la tabla
import { Op, Sequelize } from 'sequelize';
import {
  generarMailGetCredencial,
  generarMailRegistro,
  initServerMail,
} from '../utils/email/email.utils';

export const sendMailAvisoRegistro = async (req: Request, res: Response) => {
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
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.json({
        status: 200,
        msg: 'Email enviado',
      });
    }
  });
};
export const sendMailGetCredencial = async (req: Request, res: Response) => {
  const apellido = req.body.apellido;
  const telefono = req.body.telefono;

  const cliente = await Cliente.findOne({ where: { apellido: apellido, telefono: telefono } });
  if (cliente === undefined) {
    console.log('No se encuentra el cliente');
    return res.status(404).json({
      status: 404,
      msg: 'No se encuentra el cliente',
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
  console.log('Mensage generado');
  transport.sendMail(message, function (error, info) {
    if (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        msg: 'Error',
      });
    } else {
      console.log('Email sent: ' + info.response);
      return res.json({
        status: 200,
        msg: 'Email enviado',
      });
    }
  });
};
