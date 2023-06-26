// imports
const areaService = require('../services/area.service');
const postService = require('../services/post.service');
const utils = require('../utils/app');

const createArea = async (req, res, next) => {
  try {
    let areaBody = req.body;

    const savedArea = await areaService.createArea(areaBody);
    res.send(savedArea);
  } catch (error) {
    next(error);
  }
};

const getAreas = async (req, res, next) => {
  try {
    let searchParams = {};
    const areas = await areaService.readArea(searchParams);
    res.send(areas);
  } catch (error) {
    next(error);
  }
};

const getPostCountByArea = async (req, res, next) => {
  try {
    let searchParams = {};

    let userId = req.params.userId;
    if (userId && userId.toLowerCase() != 'all') {
      searchParams.writter = userId;
    }

    let areas = await areaService.readArea();

    let count = [];

    areas.forEach((c) => {
      searchParams.areaname = c._id;
      count.push(postService.countPosts(searchParams));
    });

    count = await Promise.all(count);

    const result = utils.combineArrayObjectAndArray(
      areas,
      ['_id', 'areaname'],
      count,
      'count'
    );

    res.send(result);
  } catch (error) {
    next(error);
  }
};

// exports
module.exports = {
  createArea,
  getAreas,
  getPostCountByArea,
};
