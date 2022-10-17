const { Schema, model } = require('mongoose');

const ContactModel = model('contacts', new Schema({
  ownerId: {
    type: Schema.Types.String,
    required: true,
  },
  foreignId: {
    type: Schema.Types.String,
    required: true,
  },
  username: {
    type: Schema.Types.String,
    required: true,
  },
  profileName: {
    type: Schema.Types.String,
    trim: true,
    required: true,
  },
  avatar: {
    type: Schema.Types.String,
    required: true,
  },
}));

module.exports = ContactModel;
