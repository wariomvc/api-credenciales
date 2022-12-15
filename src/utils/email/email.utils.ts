import nodemailer from 'nodemailer';
import { templateGetCredencial, templateRegistro } from './email.template';

export const initServerMail = () => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTPSERVER,
    port: parseInt(process.env.SMTPPORT),
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

export const generarMailRegistro = (
  email: string,
  nombre: string,
  apellido: string,
  codigo: string,
) => {
  const message = {
    from: 'sender@server.com',
    to: email,
    subject: 'Confirmacion de Registro ExaKIDS',
    text: templateRegistro(nombre, apellido, codigo).text,
    html: templateRegistro(nombre, apellido, codigo).html,
    attachments: [
      {
        filename: 'logo.png',
        path: 'src/assets/mail/logo.png',
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
    from: 'sender@server.com',
    to: email,
    subject: 'Confirmacion de Registro ExaKIDS',
    text: templateGetCredencial(nombre, apellido).text,
    html: templateGetCredencial(nombre, apellido).html,
    attachments: [
      {
        filename: 'logo.png',
        path: 'src/assets/mail/logo.png',
        cid: 'logo', //same cid value as in the html img src
      },
      {
        filename: 'logo.png',
        path: `src/assets/mail/logo.png`,
        cid: 'credencial', //same cid value as in the html img src
      },
    ],
  };
  return message;
};
