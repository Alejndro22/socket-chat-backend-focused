import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { dbConnection } from '../database/config.js';
import {
  authRouter,
  categoriesRouter,
  chatRouter,
  searchRouter,
  productsRouter,
  uploadsRouter,
  userRouter,
} from '../routes/index.js';
import { socketController } from '../sockets/socket-controller.js';

class ServerApp {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.httpServer = createServer(this.app);
    this.io = new Server(this.httpServer);

    this.paths = {
      auth: '/api/auth',
      categories: '/api/categories',
      chat: '/api/chat',
      products: '/api/products',
      search: '/api/search',
      uploads: '/api/uploads',
      users: '/api/users',
    };

    // Conectar a db
    this.connectDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi app
    this.routes();

    // Sockets
    this.sockets();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body (JSON)
    this.app.use(express.json());

    // Directorio público
    this.app.use(express.static('public'));

    // Handle file uploads
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, authRouter);
    this.app.use(this.paths.categories, categoriesRouter);
    this.app.use(this.paths.chat, chatRouter);
    this.app.use(this.paths.products, productsRouter);
    this.app.use(this.paths.search, searchRouter);
    this.app.use(this.paths.uploads, uploadsRouter);
    this.app.use(this.paths.users, userRouter);
  }

  sockets() {
    this.io.on('connection', (socket) => socketController(socket, this.io));
  }

  listen() {
    this.httpServer.listen(this.port, () => {
      console.log('Server running on port', this.port);
    });
  }
}

export default ServerApp;
