// validate if JWT is correct
let user = null;
let socket = null;
const url = `${window.location.origin}/api/auth/`;

// HTML refs
const txtUid = document.querySelector('#txtUid');
const txtMsg = document.querySelector('#txtMsg');
const ulUsers = document.querySelector('#ulUsers');
const ulMsgs = document.querySelector('#ulMsgs');
const btnLogout = document.querySelector('#btnLogout');

// validate token in localStorage
const validateJWT = async () => {
  const token = localStorage.getItem('token') || '';

  if (token.length <= 10) {
    window.location = 'index.html';
    throw new Error('No token in server');
  }

  // send token
  const resp = await fetch(url, {
    headers: { 'x-token': token },
  });

  const { user: userDB, token: tokenDB } = await resp.json();
  localStorage.setItem('token', tokenDB);
  user = userDB;
  document.title = user.name;

  await connectSocket();
};

const connectSocket = async () => {
  // send token to socket connection (located in handshake)
  socket = io({
    extraHeaders: {
      'x-token': localStorage.getItem('token'),
    },
  });

  // as code above is sync, i can create events when it triggers
  socket.on('connect', () => {
    console.log('sockets online');
  });

  socket.on('disconnect', () => {
    console.log('sockets offline');
  });

  socket.on('receibe-messages', (payload) => {
    displayMessages(payload);
  });

  socket.on('active-users', (payload) => {
    displayUsers(payload);
  });

  socket.on('private-messages', (payload) => {
    console.log(payload);
  });
};

const displayUsers = (users = []) => {
  let usersHTML = '';
  users.forEach(({ name, uid }) => {
    usersHTML += `
      <li>
        <p>
          <h5 class="text-success">${name}</h5>
          <span class="fs-6 text-muted">${uid}</span>
        </p>
      </li>
    `;
  });

  ulUsers.innerHTML = usersHTML;
};

const displayMessages = ({ messages } = []) => {
  let messagesHTML = '';
  messages.forEach(({ message, sender }) => {
    messagesHTML += `
      <li>
        <p>
          <span class="text-primary">${sender.name}</span>
          <span>${message}</span>
        </p>
      </li>
    `;
  });

  ulMsgs.innerHTML = messagesHTML;
};

txtMsg.addEventListener('keyup', ({ keyCode }) => {
  const msg = txtMsg.value;
  const uid = txtUid.value;
  const token = localStorage.getItem('token');

  if (keyCode !== 13) return;
  if (msg.length === 0) return;
  socket.emit('send-msg', { baseUrl: window.location.origin, msg, uid, token });

  txtMsg.value = '';
});

const main = async () => {
  await validateJWT();
};

main();
