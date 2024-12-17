import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';
import Profile from './components/Profile';
import toast, { Toaster } from 'react-hot-toast';
import List from './components/List';
import Settings from './components/Settings';
import Navbar from './components/Navbar';
import Reels from './components/Reels';

function App() {
    return (<div className='bg-black w-full h-full text-white'>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/profile/*" element={<Profile />}></Route>
            <Route path="/list" element={<List />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
            <Route path="/navbar" element={<Navbar />}></Route>
            <Route path="/reels" element={<Reels />}></Route>
        </Routes>
        <Navbar />
    </div>);
}
export default App;