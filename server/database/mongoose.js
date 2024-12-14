const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27018/insta-clone');

//mongoose.connect(`${process.env.MONGODB_URL}/insta-clone`);