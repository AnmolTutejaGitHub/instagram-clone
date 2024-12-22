import { useState, useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

function Settings() {
    const [userObj, setUserObj] = useState({});
    const { user, setUser } = useContext(UserContext);
    const [bio, setBio] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function getUserData() {
        try {
            const response = await axios.post(`http://localhost:8080/getUser`, {
                username: user
            })
            setUserObj(response.data);
        } catch (e) {
            console.log(e);
        }
    }


    async function EditProfile() {
        const toastId = toast.loading('Posting...');
        try {
            const response = await axios.post(`http://localhost:8080/editProfile`, {
                bio: bio,
                password: password,
                username: user
            })
            toast.success('Updated!');
        } catch (e) {
            toast.error('An error occurred');
            console.log(e);
        } finally {
            toast.dismiss(toastId);
        }
    }

    function logout() {
        localStorage.removeItem('token');
        setUser(null);
        sessionStorage.removeItem('user');
        navigate('/');
    }
    useEffect(() => {
        getUserData();
    })
    return (
        <div className='flex flex-col gap-6 p-10'>
            <p className=' text-xl p-2 font-bold'>Edit profile</p>
            <div className=' p-4 bg-[#262626] rounded-xl w-[50%] flex justify-between flex-wrap h-[40%] items-center'>
                <div className='flex gap-4 items-center'>
                    <img src='https://avatar.iran.liara.run/public/boy' className='w-16'></img>
                    <p>{userObj.name}</p>
                </div>
                <button className='bg-[#0095F6] hover:bg-blue-500 p-2 rounded-md text-[13px] cursor-pointer'>change Photo</button>
            </div>

            <div className='w-full flex flex-col gap-2'>
                <p className='font-bold text-[16px]'>Bio</p>
                <textarea className='w-[50%] bg-black outline-white p-2 border border-[#323539]' value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <div className='flex flex-col gap-2'>
                <p>Gender</p>
                <div>
                    <input className='bg-inherit outline-none border-b  border-white w-[50%]' value={userObj.gender || `N/A`}></input>
                    <p className='text-gray-500 text-[12px]'>This won't be part of your public profile.</p>
                </div>
            </div>

            <div className='flex flex-col gap-2'>
                <p>Change Password</p>
                <div>
                    <input className='bg-inherit outline-none border-b  border-white w-[50%]' onChange={(e) => setPassword(e.target.value)}></input>
                </div>
            </div>

            <div className='flex gap-2'>
                <button className='bg-[#0095F6] hover:bg-blue-500 w-16 p-2 rounded-md' onClick={logout}>Logout</button>
                <button className='bg-[#0095F6] hover:bg-blue-500 w-16 p-2 rounded-md' onClick={EditProfile}>submit</button>
            </div>
        </div >)
}
export default Settings;