import { checkJWT } from '../helpers/index.js';
import { ChatUsers } from '../models/index.js';

const chatUsers = new ChatUsers();

// io is the reference to mi socket server, to avoid necessity to emit and broadcast
const socketController = async (socket, io) => {
  // check token with helper function to allow socket connection
  const user = await checkJWT(socket.handshake.headers['x-token']);

  if (!user) {
    return socket.disconnect();
  }
  // Add connected user to ChatUsers
  chatUsers.connectUser(user);
  io.emit('active-users', chatUsers.usersArr);

  // Pop user when disconnected
  socket.on('disconnect', () => {
    chatUsers.disconnectUser(user.id);
    io.emit('active-users', chatUsers.usersArr);
  });
};

export { socketController };
