import { Schema, model } from 'mongoose';

const ChatSchema = Schema({
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  global: {
    type: Boolean,
    default: false,
  },
  unique_receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

ChatSchema.methods.toJSON = function () {
  const { __v, ...chat } = this.toObject();
  return chat;
};

const Chat = model('Chat', ChatSchema);
export default Chat;
