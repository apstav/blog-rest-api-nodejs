// imports
const mongoose = require('mongoose');
const utils = require('../utils/app');

const { Schema } = mongoose;

//schema definition
const PostSchema = new Schema({
  writter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    default: '',
  },
  posted: {
    type: String,
    default: utils.getCurretDate(),
  },
  area: {
    type: Schema.Types.ObjectId,
    ref: 'Area',
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  reacts: {
    like: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    love: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    funny: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    sad: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    informative: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  comments: [
    {
      people: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      time: {
        type: String,
        default: utils.getCurretDate(),
      },
      body: {
        type: String,
        required: true,
      },
    },
  ],
});

const Post = mongoose.model('Post', PostSchema);

// exports
module.exports = {
  Post,
};
