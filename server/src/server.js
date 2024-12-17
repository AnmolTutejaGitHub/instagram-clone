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
    const posts = await Post.find({ user: username }).sort({ createdAt: -1 });;
    res.status(200).send(posts);
})

app.post('/follow', async (req, res) => {
    const { followHim, follower } = req.body;
    const user1 = await User.findOne({ name: followHim });
    const user2 = await User.findOne({ name: follower });

    if (!user2.following.includes(user1.name)) {
        user2.following.push(user1.name);
        user1.followers.push(user2.name);
        await user1.save();
        await user2.save();
    }
    res.status(200).send("followed");
})

app.post('/unfollow', async (req, res) => {
    const { unfollowHim, follower } = req.body;
    const user1 = await User.findOne({ name: unfollowHim });
    const user2 = await User.findOne({ name: follower });

    if (user2.following.includes(user1.name)) {
        user2.following = user2.following.filter((f) => f != user1.name);
        user1.followers = user1.followers.filter((f) => f != user2.name);
        await user1.save();
        await user2.save();
    }
    res.status(200).send("unfollowed");
})

app.post('/getFollowers', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ name: username });
    res.status(200).send(user.followers);
})

app.post('/searchUser', async (req, res) => {
    const { searchTerm } = req.body;
    const user = await User.findOne({ name: searchTerm });
    if (user) return res.status(200).send(user);
    res.status(400).send("User doesn't exist");
})

app.post('/isFollowing', async (req, res) => {
    const { followingUser, followedUser } = req.body;
    const user1 = await User.findOne({ name: followingUser });
    const user2 = await User.findOne({ name: followedUser });

    if (user1 && user2 && user1.following.includes(user2.name)) return res.status(200).send("Following");
    res.status(400).send("Not Following");
})

app.post('/getList', async (req, res) => {
    const { followerlist, username } = req.body;
    const user = await User.findOne({ name: username });
    if (followerlist) return res.status(200).send(user.followers);
    res.status(200).send(user.following);
})


app.post('/getFollowingPosts', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ name: username });
    const posts = await Post.find({ user: { $in: user.following } }).sort({ createdAt: -1 });
    res.status(200).send(posts);
})

app.get('/getReels', async (req, res) => {
    const videos = await Post.find({ url: { $regex: /\.(mp4|avi|mov|mkv|webm|flv)$/i } }).sort({ createdAt: -1 });
    res.status(200).send(videos);
})

app.post('/editProfile', async (req, res) => {
    const { bio, username, password } = req.body;
    const user = await User.findOne({ name: username });
    user.bio = bio;
    if (password.trim() != '') user.password = password
    await user.save();
    res.status(200).send("success");
})

app.post('/getPost', async (req, res) => {
    const { postid } = req.body;
    const post = await Post.findById(postid);
    if (!post) res.status(400).send("Deleted by creator");
    res.status(200).send(post);
})

app.post('/likePost', async (req, res) => {
    const { postid, username } = req.body;
    const post = await Post.findById(postid);
    post.likes.push(username);
    await post.save();
    res.status(200).send("post liked");
})

app.post('/wasLiked', async (req, res) => {
    const { postid, username } = req.body;
    const post = await Post.findById(postid);
    if (!post) return res.status(400).send("Post deleted");
    if (post.likes.includes(username)) return res.status(200).send("liked");
    res.status(400).send("Not Liked");
})

app.post('/unlikepost', async (req, res) => {
    const { postid, username } = req.body;
    const post = await Post.findById(postid);
    if (!post) return res.status(400).send("Post deleted");
    if (post.likes.includes(username)) {
        post.likes = post.likes.filter((u) => u != username);
        await post.save();
        return res.status(200).send(post);
    }
    res.status(400).send("Not found");
})

app.post('/savePost', async (req, res) => {
    const { postid, username } = req.body;
    const user = await User.findOne({ name: username });
    user.saved.push(postid);
    await user.save();
    res.status(200).send("Saved");
})

app.post('/unSavePost', async (req, res) => {
    const { postid, username } = req.body;
    const user = await User.findOne({ name: username });
    user.saved = user.saved.filter((id) => id != postid);
    await user.save();
    return res.status(200).send("Post Unsaved");
})

app.post('/wasSaved', async (req, res) => {
    const { postid, username } = req.body;
    const user = await User.findOne({ name: username });
    if (user.saved.includes(postid)) return res.status(200).send("Saved");
    res.status(400).send("Not Saved");

})

app.post('/getSavedPost', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ name: username });
    res.status(200).send(user.saved);
})

app.post('/editCaption', async (req, res) => {
    const { caption, postid } = req.body;
    const post = await Post.findById(postid);
    post.caption = caption;
    await post.save();
    res.status(200).send("edited");
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