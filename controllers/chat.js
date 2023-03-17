import { request, response } from 'express';
import { isObjectIdOrHexString, Types } from 'mongoose';
import { Chat } from '../models/index.js';

const getMessages = async (req = request, res = response) => {
  const { limit = 10, from = 0 } = req.query;
  const userId = req.user._id;
  // const query = { state: true };

  // Se puede usar para lanzar peticiones asincronas de forma simultanes
  const messages = await Chat.find({
    $or: [{ unique_receiver: userId }, { sender: userId }, { global: true }],
  })
    .skip(from)
    .limit(limit)
    .populate('sender', 'name');

  res.json({
    messages,
  });
};

const sendMessage = async (req = request, res = response) => {
  const { message, global, unique_receiver } = req.body;
  const sender = req.user._id;

  let msg;
  if (global) {
    msg = new Chat({ message, sender, global });
  } else {
    msg = new Chat({ message, sender, unique_receiver });
  }
  await msg.save();

  res.status(201).json(msg);
};

export { getMessages, sendMessage };
