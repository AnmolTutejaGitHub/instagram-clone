import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';
import Profile from './components/Profile';
import toast, { Toaster } from 'react-hot-toast';
import List from './components/List';
import Settings from './components/Settings';
import Navbar from './components/Navbar';
import Reels from './components/Reels';
import Post from './components/Post';
import Message from './components/Message';
import Notification from './components/Notification';
import UserStories from './components/UserStories';
import Room from './components/Room';
import Login from './components/Login';
import OTPValidation from './components/OTPValidation';
import Signup from './components/Signup';
import ForgetPassword from './components/ForgetPassword';

function App() {
    const location = useLocation();
    return (<div className='bg-black w-full h-full text-white'>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/profile/*" element={<Profile />}></Route>
            <Route path="/list" element={<List />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
            <Route path="/navbar" element={<Navbar />}></Route>
            <Route path="/reels" element={<Reels />}></Route>
            <Route path="/post" element={<Post />}></Route>
            <Route path="/messages" element={<Message />}></Route>
            <Route path="/notifications" element={<Notification />}></Route>
            <Route path="/stories" element={<UserStories />}></Route>
            <Route path="/DMroom" element={<Room />}></Route>
            <Route path="/" element={<Login />}></Route>
            <Route path="/OTPValidation" element={<OTPValidation />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/forgetpassword" element={<ForgetPassword />}></Route>
        </Routes>
        {!['/', '/signup', '/forgetpassword', '/OTPValidation'].includes(location.pathname) && <Navbar />}
    </div>);
}
export default App;