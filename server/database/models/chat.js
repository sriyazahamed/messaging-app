const { Schema, model } = require('mongoose');

const ChatModel = model('chats', new Schema({
  roomId: {
    type: Schema.Types.String,
    required: true,
  },
  userId: {
    type: Schema.Types.String,
    required: true,
  },
  from: {
    type: Schema.Types.String,
    required: true,
  },
  message: {
    type: Schema.Types.String,
    trim: true,
    required: true,
  },
  condition: {
    type: Schema.Types.String,
    enum: ['pending', 'sent', 'read'],
    default: 'sent',
  },
  reply: {
    type: Schema.Types.String,
  },
}, {
  timestamps: true,
}));

module.exports = ChatModel;
