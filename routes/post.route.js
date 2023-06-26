// imports
const express = require('express');
const createErrors = require('http-errors');
const postController = require('../controllers/post.controller');

const { verifyAccessToken } = require('../utils/jwt.util');

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/posts');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.' + file.originalname.split('.').reverse()[0]);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype != 'image/jpeg' && file.mimetype != 'image/png') {
    cb(null, false);
    cb(createErrors.BadRequest('File type must be of jpg, jpeg or png!'));
  } else if (!req.body.title) {
    cb(null, false);
    cb(createErrors.BadRequest('Title must not be empty!'));
  } else if (!req.body.category) {
    cb(null, false);
    cb(createErrors.BadRequest('Category must not be empty!'));
  } else if (!req.body.body) {
    cb(null, false);
    cb(createErrors.BadRequest('Body must not be empty!'));
  } else {
    cb(null, true);
  }
};

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
  fileFilter: fileFilter,
});

// constants
const router = express.Router();

// route: post/

router.post(
  '/',
  verifyAccessToken,
  upload.single('img'),
  verifyAccessToken,
  postController.createPost
);
router.get('/details/:postId', postController.getSinglePost);
router.get('/:userId?/:areaId?', postController.getPostList);
router.put('/react', verifyAccessToken, postController.reactToPost);
router.post('/comment', verifyAccessToken, postController.commentToPost);
router.delete('/comment', verifyAccessToken, postController.deleteComment);

// exports
module.exports = router;
