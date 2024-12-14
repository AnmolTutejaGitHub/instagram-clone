import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';
import Profile from './components/Profile';
import toast, { Toaster } from 'react-hot-toast';
import List from './components/List';
function App() {
    return (<div className='bg-black w-full h-full text-white'>
        <Toaster position="top-center" reverseOrder={false} />
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<Home />}></Route>
                <Route path="/profile/*" element={<Profile />}></Route>
                <Route path="/list" element={<List />}></Route>
            </Routes>
        </BrowserRouter>
    </div>);
}
export default App;