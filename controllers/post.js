const Post = require('../models/Post.js');
const { errorHandler } = require('../auth.js');

module.exports.addPost = (req, res) => {
	let newPost = new Post({
		title: req.body.title,
		content: req.body.content,
		authorId: req.user.id,
		authorName: req.user.username
	});

	return newPost.save()
	.then(result => res.status(201).json(result))
	.catch(err => errorHandler(err, req, res));
};

module.exports.getAllPosts = (req, res) => {
    return Post.find({})
    .then(result => {
        if(!result) {
            return res.status(404).json({ error: 'No blog posts found' });
        } else {
            return res.status(200).json({ posts: result });
        }  
    })
    .catch(err => errorHandler(err, req, res));
};

module.exports.getPostById = (req, res) => {
    return Post.findById(req.params.postId)
    .then(result => {
        if(result) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ error: 'Blog post not found' });
        }
    })
    .catch(err => errorHandler(err, req, res));
};

module.exports.updatePost = (req, res) => {
	let updatedPost = {
		title: req.body.title,
		content: req.body.content
	};

    return Post.findByIdAndUpdate(req.params.postId, updatedPost)
    .then(result => {
        if(!result) {
            return res.status(404).json({ error: 'Blog post not found' });
        } else {
            return res.status(200).json({
            	message: 'Blog post updated successfully',
            	updatedPost: result
            });
        }  
    })
    .catch(err => errorHandler(err, req, res));
};

module.exports.deletePost = (req, res) => {
    return Post.findByIdAndDelete(req.params.postId)
    .then(result => {
        if(!result) {
            return res.status(404).json({ error: 'Blog post not found' });
        } else {
            return res.status(200).json({ message: 'Blog post deleted successfully' });
        }  
    })
    .catch(err => errorHandler(err, req, res));
};

module.exports.addPostComment = (req, res) => {
    return Post.findById(req.params.postId)
    .then(result => {
        if(result) {
            result.comments.push({
                userId: req.user.id,
                comment: req.body.comment
            });

            return result.save()
            .then(result => res.status(200).json({
                message: 'comment added successfully',
                updatedPost: result
            }))
            .catch(err => errorHandler(err, req, res));
        } else {
            return res.status(404).json({ error: 'Blog post not found' });
       	}
    })
    .catch(err => errorHandler(err, req, res));
};

module.exports.deletePostComment = (req, res) => {
    return Post.findById(req.params.postId)
    .then(result => {
        if(result) {
            let index = result.comments.findIndex(comment => comment._id.toString() === req.params.commentId)

            result.comments.splice(index, 1);

            return result.save()
            .then(result => res.status(200).json({ message: 'Comment deleted successfully' }))
            .catch(err => errorHandler(err, req, res));
        } else {
            return res.status(404).json({ error: 'Blog post not found' });
       	}
    })
    .catch(err => errorHandler(err, req, res));
};