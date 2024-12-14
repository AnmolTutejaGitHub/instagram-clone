const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    user: {
        type: String
    },
    url: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        default: function () {
            return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hr
        },
    },
    expired: {
        type: Boolean,
        default: false
    },
    viewers: [String],
});

storySchema.pre('save', function (next) {
    if (this.expiresAt <= Date.now()) {
        this.expired = true;
    }
    next();
});

const Story = mongoose.model('Story', storySchema);

module.exports = { Story, storySchema };