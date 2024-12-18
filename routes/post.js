const express = require('express');
const postController = require('../controllers/post.js');
const { verify } = require('../auth.js');

const router = express.Router();

router.post('/addPost', verify, postController.addPost);

router.get('/getPosts', postController.getAllPosts);

router.get('/getPost/:postId', postController.getPostById);

router.patch('/updatePost/:postId', verify, postController.updatePost);

router.delete('/deletePost/:postId', verify, postController.deletePost);

router.patch('/addComment/:postId', verify, postController.addPostComment);

router.patch('/deleteComment/:postId/:commentId', verify, postController.deletePostComment);

module.exports = router;