// imports
const createErrors = require('http-errors');
const cloudinary = require('../utils/cloudinary.util');
const postService = require('../services/post.service');

const createPost = async (req, res, next) => {
  try {
    let postBody = req.body;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(postBody.img, {
        folder: 'posts',
      });

      if (uploadResult.secure_url) {
        postBody.img = uploadResult.secure_url;
      } else {
        throw createErrors.Forbidden('Image upload failed');
      }
    }

    postBody.writter = req.body.userId;

    const savedPost = await postService.createPost(postBody);
    res.send(savedPost);
  } catch (error) {
    next(error);
  }
};

const getPostList = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const areaId = req.params.areaId;

    let searchParams = {};
    if (userId && userId.toLowerCase() != 'all') {
      searchParams.writter = userId;
    }
    if (areaId && areaId.toLowerCase() != 'all') {
      searchParams.area = areaId;
    }

    let selectFields = 'posted title img';

    const numPosts = await postService.countPosts(searchParams);
    let posts = await postService.readPosts(searchParams, selectFields);

    res.send({
      result: posts,
      totalPosts: numPosts,
    });
  } catch (error) {
    next(error);
  }
};

const getSinglePost = async (req, res, next) => {
  try {
    let searchParams = { _id: req.params.postId };
    let selectFields = '';
    let post = await postService.readPosts(searchParams, selectFields);

    post = post[0];
    if (!post) {
      throw createErrors.NotFound('No post found with this post id');
    }

    res.send(post);
  } catch (error) {
    next(error);
  }
};

const reactToPost = async (req, res, next) => {
  try {
    let reactBody = req.body;
    const searchParams = { _id: reactBody.postId };
    const selectFields = '';

    let post = await postService.readPosts(searchParams, selectFields);
    if (post.length == 0) {
      throw createErrors.NotFound('This post does not exists');
    }

    post = post[0];
    const updatedPost = await postService.reactPost(post, reactBody);
    res.send(updatedPost);
  } catch (error) {
    next(error);
  }
};

const commentToPost = async (req, res, next) => {
  try {
    const commentBody = req.body;
    if (commentBody.body.trim().length == 0) {
      throw createErrors.BadRequest('Comment must not be empty!');
    }

    const searchParams = { _id: commentBody.postId };
    const selectFields = '';

    let post = await postService.readPosts(searchParams, selectFields);
    if (post.length == 0) {
      throw createErrors.NotFound('This post does not exists');
    }
    post = post[0];

    let updatedPost = await postService.postComment(post, commentBody);
    res.send(updatedPost);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const commentBody = req.body;
    const searchParams = { _id: commentBody.postId };
    const selectFields = '';

    let post = await postService.readBlogs(searchParams, selectFields);
    if (post.length == 0) {
      throw createErrors.NotFound('This post does not exists');
    }
    post = post[0];

    const updatedPost = await postService.deleteComment(post, commentBody);
    res.send(updatedPost);
  } catch (error) {
    next(error);
  }
};

// exports
module.exports = {
  createPost,
  getPostList,
  getSinglePost,
  reactToPost,
  commentToPost,
  deleteComment,
};
