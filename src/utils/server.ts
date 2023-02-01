import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import clientesRoutes from '../routers/clientes.routers';
import emailRoutes from '../routers/email.routers';
import authRoutes from '../routers/auth.routers';
import premiosRoutes from '../routers/premios.routers';
import usuariosRoutes from '../routers/usuarios.routers';
import https from 'https';
import fs from 'fs';

class Server {
  private app: Application;
  private port: number;
  private apiPaths = {
    clientes: '/api/clientes',
    email: '/api/email',
    auth: '/api/auth',
    premios: '/api/premios',
    usuarios: '/api/usuarios',
  };
  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000');
    this.middlewares();
    this.routes();
  }

  routes() {
    this.app.use(this.apiPaths.clientes, clientesRoutes);
    this.app.use(this.apiPaths.email, emailRoutes);
    this.app.use(this.apiPaths.auth, authRoutes);
    this.app.use(this.apiPaths.premios, premiosRoutes);
    this.app.use(this.apiPaths.usuarios, usuariosRoutes);
    console.log('Agregadas las rutas');
  }
  middlewares() {
    this.app.use(
      cors({
        origin: '*', //servidor que deseas que consuma o (*) en caso que sea acceso libre
        credentials: true,
      }),
    );
    this.app.use(
      fileUpload({
        tempFileDir: '/tmp/',
        createParentPath: true,
        debug: true,
        useTempFiles: true,
        safeFileNames: true,
        preserveExtension: 4,
        limits: { fileSize: 5 * 1024 * 1024 },
        abortOnLimit: true,
      }),
    );

    this.app.use(express.json());
    this.app.use(morgan('dev'));
  }
  options = {
    key: fs.readFileSync(__dirname + '/client-key.pem'),
    cert: fs.readFileSync(__dirname + '/client.csr'),
  };
  listen() {
    https.createServer(this.options, this.app).listen(3000);

    /* this.app.listen(this.port, '0.0.0.0', () => {
      console.log('Servidor Escuchando en el puerto ' + this.port);
    }); */
  }
}

export default Server;
