const express = require('express');
const createErrors = require('http-errors');
const userController = require('../controllers/user.controller');

const {
  validateUserEditReq,
  validateRegisterReq,
  validateLoginReq,
} = require('../middlewares/user.middleware');
const { verifyAccessToken } = require('../utils/jwt.util');

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.' + file.originalname.split('.').reverse()[0]);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype != 'image/jpeg' && file.mimetype != 'image/png') {
    cb(null, false);
    cb(createErrors.BadRequest('File type must be of jpg, jpeg or png!'));
  } else if (!req.body.email) {
    cb(null, false);
    cb(createErrors.BadRequest('Email must not be empty!'));
  } else if (!req.body.first_name) {
    cb(null, false);
    cb(createErrors.BadRequest('First name must not be empty!'));
  } else if (!req.body.last_name) {
    cb(null, false);
    cb(createErrors.BadRequest('Last name must not be empty!'));
  } else {
    cb(null, true);
  }
};

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1,
  },
  fileFilter: fileFilter,
});

// constants
const router = express.Router();

// route: user/

router.post('/register', validateRegisterReq, userController.registerUser);
router.post('/login', validateLoginReq, userController.loginUser);

router.put(
  '/editProfile',
  verifyAccessToken,
  validateUserEditReq,
  upload.single('img'),
  verifyAccessToken,
  userController.editUser
);

router.post('/me/refreshToken', userController.refreshToken);
router.get('/me', verifyAccessToken, userController.getMyData);
router.get('/userProfile/:userId', userController.getUserProfile);
router.delete('/logout', userController.logout);

// exports
module.exports = router;
