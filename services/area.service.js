// imports
const createErrors = require('http-errors');
const { Area } = require('../models/area.model');

// CRUD

const createArea = async (areaBody) => {
  try {
    const newArea = new Area(areaBody);
    const savedArea = await newArea.save();
    return Promise.resolve(savedArea);
  } catch (error) {
    if (error.code && error.code == 11000) {
      // eslint-disable-next-line no-ex-assign
      error = createErrors.Forbidden(`${areaBody.name} already exists`);
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
};

const readArea = async () => {
  try {
    const areas = await Area.find().select('areaname');
    return Promise.resolve(areas);
  } catch (error) {
    return Promise.reject(error);
  }
};

const findAreaById = async (areaId) => {
  try {
    const area = await Area.findById(areaId);
    return Promise.resolve(area);
  } catch (error) {
    return Promise.reject(error);
  }
};

// exports
module.exports = {
  createArea,
  readArea,
  findAreaById,
};
