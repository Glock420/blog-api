const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Title is required']
	},
	content: {
		type: String,
		required: [true, 'Content is required']
	},
	authorId: {
		type: String,
		required: [true, 'User ID of post author is required']
	},
	authorName: {
		type: String,
		required: [true, 'Username of post author is required']
	},
	comments: [
		{
			userId: {
				type: String,
				required: [true, 'User ID of commentor is required']
			},
			comment: {
				type: String,
				required: [true, 'Comment content is required']
			}
		}
	],
	createdOn: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Post', postSchema);