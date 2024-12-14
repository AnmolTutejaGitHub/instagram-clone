const mongoose = require('mongoose');

const ReelSchema = new mongoose.Schema({
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
    comments: [CommentSchema],
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Reel = mongoose.model('Reel', ReelSchema);
module.exports = Reel;