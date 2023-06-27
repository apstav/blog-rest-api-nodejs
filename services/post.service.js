// imports

const { Post } = require('../models/post.model');

// CRUD

const createPost = async (postBody) => {
  try {
    const newPost = new Post(postBody);
    let savedPost = await newPost.save();

    savedPost = (await savedPost).populate(
      'writter',
      'firstname lastname joined'
    );
    savedPost = (await savedPost).populate('area', 'areaname');
    savedPost = (await savedPost).populate(
      'comments.people',
      'firstname lastname'
    );

    return Promise.resolve(savedPost);
  } catch (error) {
    return Promise.reject(error);
  }
};

const readPosts = async (searchParams = {}) => {
  try {
    const posts = await Post.find(searchParams);
    return Promise.resolve(posts);
  } catch (error) {
    return Promise.reject(error);
  }
};

const countPosts = async (countParams) => {
  try {
    const numPosts = await Post.where(countParams).countDocuments();
    return Promise.resolve(numPosts);
  } catch (error) {
    return Promise.reject(error);
  }
};

const reactPost = async (post, reactBody) => {
  try {
    const allReacts = ['like', 'love', 'funny', 'sad', 'informative'];
    let oldReactName = '';

    // remove all reacts of this user
    allReacts.forEach((react) => {
      post.reacts[react] = post.reacts[react].filter((r) => {
        if (reactBody.userId == r) {
          oldReactName = react;
        } else {
          return r;
        }
      });
    });

    // set new react
    if (oldReactName != reactBody.reactName) {
      post.reacts[reactBody.reactName].push(reactBody.userId);
    }

    let updatedPost = await post.save();

    return Promise.resolve(updatedPost);
  } catch (error) {
    return Promise.reject(error);
  }
};

const postComment = async (post, commentBody) => {
  try {
    post.comments.push({
      people: commentBody.userId,
      body: commentBody.body,
    });

    let updatedPost = await post.save();
    updatedPost = (await updatedPost).populate(
      'comments.people',
      'firstname lastname joined'
    );

    return Promise.resolve(updatedPost);
  } catch (error) {
    return Promise.reject(error);
  }
};

const deleteComment = async (post, commentBody) => {
  try {
    post.comments = post.comments.filter((c) => {
      if (c._id == commentBody.id && c.people._id == commentBody.userId) {
        return false;
      } else {
        return true;
      }
    });

    const updatedPost = await post.save();
    return Promise.resolve(updatedPost);
  } catch (error) {
    return Promise.reject(error);
  }
};

// exports
module.exports = {
  createPost,
  readPosts,
  countPosts,
  reactPost,
  postComment,
  deleteComment,
};
