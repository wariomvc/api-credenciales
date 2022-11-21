import { Response, Request } from 'express'; //Impporta los objetos de las peticiones
import nodemailer from 'nodemailer';
import { UploadedFile } from 'express-fileupload';
import { validationResult } from 'express-validator';
import { PDFDocument, PDFFont, StandardFonts, rgb, PDFImage } from 'pdf-lib';

import fs from 'fs/promises';
import zip from 'adm-zip';
import Cliente from '../models/Cliente'; //Importa el modelo de Cliente para el maneja de la tabla
import { Op, Sequelize } from 'sequelize';

const initServerMail = () => {
  const transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'd2e517784c4dd9',
      pass: '7ac202d1a06e4e',
    },
  });
  transport.verify(function (error, _) {
    if (error) {
      console.log(error);
    } else {
      console.log('Se inicio Correctamente el Servidor de Mails');
    }
  });
  return transport;
};
const generarMail = (email: string, nombre: string, apellido: string, codigo: string) => {
  const message = {
    from: 'sender@server.com',
    to: email,
    subject: 'Confirmacion de Registro ExaKIDS',
    text: `${nombre} ${apellido} Ya formas parte del Club de Exa kids.`,
    html: ` <div style="width: 80%; margin: 20px auto; text-align: center">
        <div
          style="
            width: 50%;
            margin: 20px auto;
            background-color: rgb(220, 68, 16);
            border-radius: 30px;
          "
        >
          <img src="cid:logo" alt="exakids logo"  style="width: 50%" />
        </div>
        <div style="width: 50%; margin: auto">
          <h1>Felicidades!!!</h1>
          <p style="font-size: 20px;">${nombre} ${apellido} Ya formas parte del Club de Exa kids.</p>
          <p style="font-size: 20px;">
            Comenzaremos a trabajar en tu credencial lo mas pronto posible, te avisaremos cuando se
            encuentre lista para que la puedas recoger.
          </p>
          <p style="font-size: 20px;">
            Tu numero de socio es: ${codigo}. Recuérdalo muy bien, ya que con este numero podrás
            acceder a increíbles premios en cabina en la hora de los Exa kids
          </p>
        </div>
      </div>`,
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
export const sendMailAvisoRegistro = async (req: Request, res: Response) => {
  const cliente = await Cliente.findByPk(req.params.id);
  const transport = initServerMail();
  const message = generarMail(
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
