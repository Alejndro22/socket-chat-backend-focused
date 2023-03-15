import { checkJWT } from '../helpers/index.js';

const socketController = async (socket) => {
  // check token with helper function to allow socket connection
  const user = await checkJWT(socket.handshake.headers['x-token']);

  if (!user) {
    return socket.disconnect();
  }

  console.log(`User: ${user.name} is connected`);
};

export { socketController };
