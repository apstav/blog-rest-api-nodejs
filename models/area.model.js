// imports
const mongoose = require('mongoose');

const { Schema } = mongoose;

// schema definition
const areaSchema = new Schema({
  areaname: {
    type: String,
    required: true,
  },
});

const Area = mongoose.model('Area', areaSchema);

// exports
module.exports = {
  Area,
};
