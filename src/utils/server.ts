import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import clientesRoutes from '../routers/clientes.routers';
import emailRoutes from '../routers/email.routers';
import authRoutes from '../routers/auth.routers';

class Server {
  private app: Application;
  private port: string;
  private apiPaths = {
    clientes: '/api/clientes',
    email: '/api/email',
    auth: '/api/auth',
  };
  constructor() {
    this.app = express();
    this.port = process.env.PORT || '3000';
    this.middlewares();
    this.routes();
  }

  routes() {
    this.app.use(this.apiPaths.clientes, clientesRoutes);
    this.app.use(this.apiPaths.email, emailRoutes);
    this.app.use(this.apiPaths.auth, authRoutes);
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
        preserveExtension: true,
        limits: { fileSize: 5 * 1024 * 1024 },
        abortOnLimit: true,
      }),
    );

    this.app.use(express.json());
    this.app.use(morgan('dev'));
  }
  listen() {
    this.app.listen(3000, '0.0.0.0', () => {
      console.log('Servidor Escuchando en el puerto ' + this.port);
    });
  }
}

export default Server;
