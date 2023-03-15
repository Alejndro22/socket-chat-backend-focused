// validate if JWT is correct
let user = null;
let socket = null;
const url = `${window.location.origin}/api/auth/`;

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
  const socket = io({
    extraHeaders: {
      'x-token': localStorage.getItem('token'),
    },
  });
};

const main = async () => {
  await validateJWT();
};

main();
