const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const { storySchema } = require('./Stroy');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('please provide valid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        trim: true,
        validate(value) {
            if (!validator.isStrongPassword(value, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })) {
                throw new Error("Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one symbol.");
            }
        }
    },
    followers: [String], // username
    following: [String],
    posts: [String], // post id
    likes: [String],
    saved: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    profilePicture: {
        type: String,
    },
    bio: {
        type: String,
        maxLength: 160,
    },
    stories: [storySchema],
})

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;