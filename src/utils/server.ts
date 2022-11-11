import express, { Application } from 'express';
import cors from 'cors';
import clientesRoutes from '../routers/clientes.routers';

class Server {
  private app: Application;
  private port: string;
  private apiPaths = {
    clientes: '/api/clientes',
  };
  constructor() {
    this.app = express();
    this.port = process.env.PORT || '3000';
    this.middlewares();
    this.routes();
  }

  routes() {
    this.app.use(this.apiPaths.clientes, clientesRoutes);
  }
  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log('Servidor Escuchando en el puerto ' + this.port);
    });
  }
}

export default Server;
