require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
require('../database/mongoose');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const socketio = require('socket.io');
const User = require('../database/Models/User');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Post = require('../database/Models/Post');

app.use(cors({
    origin: `http://localhost:3000`,
    credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 8080;


const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: `http://localhost:3000`,
        credentials: true
    }
});

app.post('/login', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const user = await User.findOne({ email, name });
        if (!user) {
            return res.status(400).send({ error: "Invalid Credentials" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).send({ error: "Invalid Credentials" });
        }

        const token = jwt.sign({ user_id: user._id }, `${process.env.TOKEN_SECRET}`, { expiresIn: '30d' });
        res.status(200).send({ token });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

app.post('/signups', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const user = new User({ email, password, name });
        await user.save();
        const token = jwt.sign({ user_id: user._id }, `${process.env.TOKEN_SECRET}`, { expiresIn: '30d' });
        res.status(200).send({ token });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
})

app.post('/verifytokenAndGetUsername', async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, `${process.env.TOKEN_SECRET}`);
        const user = await User.findById(decoded.user_id);

        if (!user) {
            return res.status(404).send({ error: 'Invalid or expired token' });
        }

        res.status(200).send({ user: user.name });
    } catch (e) {
        res.status(400).send({ error: 'Invalid or expired token' });
    }
});

app.post('/otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: "anmoltutejaserver@gmail.com",
                pass: process.env.NODEMAIL_APP_PASSWORD,
            },
        });

        let mailOptions = {
            from: "anmoltutejaserver@gmail.com",
            to: email,
            subject: 'Your login OTP',
            text: `Your OTP is: ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(400).send(error);
            }
            res.status(200).send(otp);
        });

    } catch (error) {
        res.status(400).send(error);
    }
});


app.post('/getUser', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ name: username });
    if (user) return res.status(200).send(user);
    res.status(400).send("User does not exist in database");
})



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        resource_type: 'auto',
    }
});

const upload = multer({ storage: storage, limits: { fileSize: 10000000 } });

app.post('/fileupload', upload.single('uploadfile'), async (req, res) => {
    const { username } = req.body;

    const post = new Post({
        user: username,
        url: req.file.path,
    });
    await post.save();

    const user = await User.findOne({ name: username });
    user.posts.push(post._id.toString());
    await user.save();
    res.status(200).send(post);
});


app.post('/getUserPosts', async (req, res) => {
    const { username } = req.body;
    const posts = await Post.find({ user: username });
    res.status(200).send(posts);
})


io.on('connection', (socket) => {
    socket.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    socket.on('disconnect', async () => { });
})

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})