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

  const resp = await fetch(url, {
    headers: { 'x-token': token },
  });

  const { user: userDB, token: tokenDB } = await resp.json();
  localStorage.setItem('token', tokenDB);
  user = userDB;
};

const main = async () => {
  await validateJWT();
};

main();

// const socket = io();
