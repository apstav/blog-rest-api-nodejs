// imports
const createErrors = require('http-errors');
const userService = require('../services/user.service');
const jwtUtil = require('../utils/jwt.util');
const utils = require('../utils/app');

const bcrypt = require('bcrypt');

const saltRounds = 10;
const cloudinary = require('../utils/cloudinary.util');

// CRUD

const registerUser = async (req, res, next) => {
  try {
    let userBody = req.body;

    userBody.password = await bcrypt.hash(userBody.password, saltRounds);
    const savedUser = await userService.createUser(userBody);

    const user = utils.makeObjectExcept(savedUser, [
      '_id',
      'firstname',
      'role',
    ]);
    const accessToken = await jwtUtil.signAccessToken(savedUser._id);
    const refreshToken = await jwtUtil.signRefreshToken(savedUser._id);

    res.send({
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const userBody = req.body;
    const findUser = await userService.findUniqueUser({
      email: userBody.email,
    });
    const passwordMatch = await bcrypt.compare(
      userBody.password,
      findUser.password
    );

    if (!passwordMatch) {
      throw createErrors.NotFound('Incorrect email or password');
    }

    const accessToken = await jwtUtil.signAccessToken(findUser._id);
    const refreshToken = await jwtUtil.signRefreshToken(findUser._id);

    const user = utils.makeObjectExcept(findUser, ['_id', 'firstname', 'role']);

    res.send({
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error.status == 404) {
      // eslint-disable-next-line no-ex-assign
      error = createErrors.NotFound('Incorrect email or password');
      next(error);
    }
  }
};

const editUser = async (req, res, next) => {
  try {
    let userBody = req.body;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(userBody.img);
      cloudinary.url;
      if (uploadResult) {
        userBody.img = uploadResult.secure_url;
      } else {
        throw createErrors.Forbidden('Upload failed');
      }
    }

    await userService.updateUser(userBody);

    const updateUser = await userService.findUniqueUser(
      { _id: userBody.userId },
      ['_id', 'firstname', 'role']
    );

    res.send(updateUser);
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    let oldRefreshToken = req.body.refreshToken;

    if (!oldRefreshToken) {
      throw createErrors.Forbidden('Refresh token not found');
    }

    const userId = await jwtUtil.verifyRefreshToken(oldRefreshToken);
    if (!userId) {
      throw createErrors.Forbidden('Invalid refresh token');
    }

    const accessToken = await jwtUtil.signAccessToken(userId);
    const refreshToken = await jwtUtil.signRefreshToken(userId);

    // eslint-disable-next-line no-undef
    ressend({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

const getMyData = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    let searchParams = { _id: userId };
    let selectFields = 'firstname lastname role email bio img';

    const user = await userService.findUniqueUser(searchParams, selectFields);

    res.send(user);
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw createErrors.BadRequest('No userId');
    }

    let searchParams = { _id: userId };
    let selectFields = 'img firstname lastname joined role email bio';

    const user = await userService.findUniqueUser(searchParams, selectFields);
    res.send(user);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  res.send('logout is not implemented yet');
};

// exports
module.exports = {
  registerUser,
  loginUser,
  editUser,
  refreshToken,
  getMyData,
  getUserProfile,
  logout,
};
