const { Schema, model } = require('mongoose');

exports.UserModel = model('users', new Schema({
  username: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
}));

exports.ProfileModel = model('profiles', new Schema({
  userId: {
    type: Schema.Types.String,
    required: true,
  },
  username: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    unique: true,
  },
  profileName: {
    type: Schema.Types.String,
    trim: true,
    default: '',
  },
  photo: {
    avatar: {
      type: Schema.Types.String,
      trim: true,
      default: 'avatar.png',
    },
    banner: {
      type: Schema.Types.String,
      trim: true,
      default: 'banner.png',
    },
  },
  bio: {
    type: Schema.Types.String,
    trim: true,
    maxlength: 200,
    default: '',
  },
  phone: {
    type: Schema.Types.Number,
    default: 0,
  },
  contacts: {
    type: Schema.Types.Array,
  },
}, {
  timestamps: true,
}));
