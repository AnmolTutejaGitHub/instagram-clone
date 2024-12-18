const mongoose = require('mongoose');


const notificationSchema = new mongoose.Schema({
    user: {
        type: String,
    },
    message: {
        type: String,

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    sender: {
        type: String,
    },
    refId: {
        type: String
    }
});


const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;