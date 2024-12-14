const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: {
        type: String,
    },
    url: {
        type: String
    },
    caption: {
        type: String
    },
    likes: [String], // userids/name
    comments: [String], // id
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;