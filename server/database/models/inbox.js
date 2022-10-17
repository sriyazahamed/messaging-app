const { Schema, model } = require('mongoose');

const InboxModel = model('inboxs', new Schema({
  roomType: {
    type: Schema.Types.String,
    required: true,
    default: 'private',
  },
  userId: {
    type: Schema.Types.String,
    required: true,
  },
  roomId: {
    type: Schema.Types.String,
    required: true,
  },
  owners: {
    type: Schema.Types.Array,
  },
  lastMessage: {
    from: {
      type: Schema.Types.String,
      required: true,
    },
    condition: {
      type: Schema.Types.String,
      enum: ['pending', 'sent', 'read'],
      default: 'sent',
    },
    text: {
      type: Schema.Types.String,
      trim: true,
    },
    createdAt: {
      type: Schema.Types.Date,
    },
  },
  total: {
    type: Schema.Types.Number,
    default: 0,
  },
  archived: {
    type: Schema.Types.Boolean,
    default: false,
  },
}, {
  timestamps: true,
}));

module.exports = InboxModel;
