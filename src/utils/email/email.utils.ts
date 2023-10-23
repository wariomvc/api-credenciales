import nodemailer from 'nodemailer';
import { templateGetCredencial, templateImpresion, templateRegistro } from './email.template';
import fs from 'fs';
import path from 'path';

const mailAssetsDir = path.join(__dirname, '../../../assets');

export const initServerMail = () => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTPSERVER,
    port: parseInt(process.env.SMTPPORT!),
    auth: {
      user: process.env.SMTPUSER,
      pass: process.env.SMTPPASS,
    },
  });
  /*  transport.verify(function (error, _) {
    if (error) {
      console.log(error);
    } else {
      console.log('Se inicio Correctamente el Servidor de Mails');
    }
  }); */
  return transport;
};
export const generarMailImpresion = (
  email: string,
  nombre: string,
  apellido: string,
  codigo: string,
) => {
  const message = {
    from: 'Admin ExaKids <admin@exa.mediacast.mx>',
    to: email,
    subject: 'Credencial Impresa ExaKIDS',
    text: templateImpresion(nombre, apellido, codigo).text,
    html: templateImpresion(nombre, apellido, codigo).html,
    attachments: [
      {
        filename: 'logo.png',
        path: 'bin/assets/mail/logo.png',
        cid: 'logo', //same cid value as in the html img src
      },
    ],
  };
  return message;
};
export const generarMailRegistro = (
  email: string,
  nombre: string,
  apellido: string,
  codigo: string,
) => {
  const info = loadEmailInfo();
  const message = {
    from: 'Admin ExaKids <admin@exa.mediacast.mx>',
    to: email,
    subject: info.asunto,
    text: templateRegistro(nombre, apellido, codigo, info.cuerpo).text,
    html: templateRegistro(nombre, apellido, codigo, info.cuerpo).html,
    attachments: [
      {
        filename: 'logo.jpg',
        path: path.join(mailAssetsDir, 'logo.jpg'),
        cid: 'logo', //same cid value as in the html img src
      },
    ],
  };
  return message;
};

export const generarMailGetCredencial = (
  email: string,
  nombre: string,
  apellido: string,
  codigo: string,
) => {
  const message = {
    from: 'Admin ExaKids <admin@exa.mediacast.mx>',
    to: email,
    subject: 'Confirmacion de Registro ExaKIDS',
    text: templateGetCredencial(nombre, apellido).text,
    html: templateGetCredencial(nombre, apellido).html,
    attachments: [
      {
        filename: 'logo.png',
        path: 'bin/assets/mail/logo.png',
        cid: 'logo', //same cid value as in the html img src
      },
      {
        filename: 'logo.png',
        path: `bin/assets/mail/logo.png`,
        cid: 'credencial', //same cid value as in the html img src
      },
    ],
  };
  return message;
};

interface Email {
  asunto: string;
  cuerpo: string;
  filename?: string;
}
const loadEmailInfo = () => {
  const fileData = fs.readFileSync(path.join(mailAssetsDir, 'emailinfo.json'), 'utf8');
  const object = JSON.parse(fileData) as Email;
  return object;
};