const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    user: {
        type: String,
    },
    text: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    replyTo: {
        type: String,
    },
    replies: [String], //id
});

const Reply = mongoose.model('Reply', replySchema);
module.exports = Reply;