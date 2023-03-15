import * as dotenv from 'dotenv';
import ServerApp from './models/server.js';

dotenv.config();

const server = new ServerApp();
server.listen();
