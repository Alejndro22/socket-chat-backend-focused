import axios from 'axios';
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

  // Connect to special chat room
  // it has 3: global, socket.id and user.id
  socket.join(user.id);

  // Pop user when disconnected
  socket.on('disconnect', () => {
    chatUsers.disconnectUser(user.id);
    io.emit('active-users', chatUsers.usersArr);
    socket.emit();
  });

  socket.on('send-msg', async ({ baseUrl, uid, msg, token }) => {
    let body;

    if (!uid) {
      body = { message: msg, global: true };
    } else {
      body = { message: msg, unique_receiver: uid };
    }

    try {
      const { data } = await axios.post(baseUrl + '/api/chat', body, {
        headers: {
          'Content-Type': 'application/json',
          'x-token': token,
        },
      });
    } catch (error) {
      console.log(error.response.data);
      return;
    }

    if (!uid) {
      try {
        const { data } = await axios.get(baseUrl + '/api/chat', {
          headers: {
            'x-token': token,
          },
        });
        io.emit('receibe-messages', data);
      } catch (error) {
        console.log(error.response.data);
        return;
      }
    } else {
      try {
        const { data } = await axios.get(baseUrl + '/api/chat', {
          headers: {
            'x-token': token,
          },
        });
        socket.to(uid).emit('private-messages', data);
      } catch (error) {
        console.log(error.response.data);
        return;
      }
    }

    // io.emit('receibe-messages', );

    // fetch(baseUrl + '/api/chat', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-token': token,
    //   },
    //   body: JSON.stringify(body),
    // })
    //   .then((resp) => {
    //     console.log('sent');
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  });
};

export { socketController };
