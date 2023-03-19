import { json, response } from 'express';
import bcryptjs from 'bcryptjs';
import User from '../models/user.js';
import { generateJWT } from '../helpers/generate-jwt.js';
import { googleVerify } from '../helpers/google-verify.js';

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Verify if email is registered
    if (!user)
      return res.status(400).json({
        msg: `Email: ${email} is not registered in DB`,
      });

    // Verifiy if user state is active (true)
    if (!user.state)
      return res.status(400).json({
        msg: `User state is false (DELETED)`,
      });

    // Check password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword)
      return res.status(400).json({
        msg: `Wrong password`,
      });

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Something went wrong',
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, picture, email } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    // Check if user is already register  ed
    if (!user) {
      const data = {
        name,
        email,
        password: 'xd',
        picture,
        fromGoogle: true,
      };

      user = new User(data);
      await user.save();
    }

    // If user state is falsle
    if (!user.state) {
      return res.status(401).json({
        msg: 'This user was deleted from db, please talk with DBA',
      });
    }

    // Generate jwt
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: 'Couldnt verify token',
    });
  }
};

const renewToken = async (req, res = response) => {
  const { user } = req;

  // Generate jwt
  const token = await generateJWT(user.id);

  res.json({
    user,
    token,
  });
};

export { login, googleSignIn, renewToken };
