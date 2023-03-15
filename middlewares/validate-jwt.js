import { request, response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      msg: 'No token found',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPUBLICKEY);
    // Get who made the request
    const requestFrom = await User.findById(uid);

    // Ceck if uid belongs to a user
    if (!requestFrom) {
      return res.status(401).json({
        msg: 'Not valid token - this user does not exist in db',
      });
    }

    // Verify if uid isnt deleted
    if (!requestFrom.state) {
      return res.status(401).json({
        msg: 'Not valid token - this user is inactive in db',
      });
    }

    req.user = requestFrom;

    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({
      msg: 'Not a valid token',
    });
  }
};

export { validateJWT };
