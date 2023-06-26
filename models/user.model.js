// imports
const mongoose = require('mongoose');
const utils = require('../utils/app');

const { Schema } = mongoose;

// schema definition
const userSchema = new Schema({
  img: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  joined: {
    type: String,
    default: utils.getCurretDate(),
  },
  bio: {
    type: String,
    require: false,
    default: '',
  },
});

const User = mongoose.model('User', userSchema);

// exports
module.exports = {
  User,
};
