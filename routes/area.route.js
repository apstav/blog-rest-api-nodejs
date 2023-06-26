// imports
const express = require('express');
const areaController = require('../controllers/area.controller');

// constants
const router = express.Router();

// route: area/

router.post('/', areaController.createArea);
router.get('/', areaController.getAreas);
router.get('/postByArea/:userId?', areaController.getPostCountByArea);

// exports
module.exports = router;
