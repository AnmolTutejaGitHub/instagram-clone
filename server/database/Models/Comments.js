const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user: {
        type: String
    },
    text: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    RefTo: {
        type: String //post/reel id comment id
    },
    replies: [String] // id
})



const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;