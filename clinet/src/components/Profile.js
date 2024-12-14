import { useState, useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';
import axios from 'axios';
import { RiSettings3Fill } from "react-icons/ri";
import { CiBookmark } from "react-icons/ci";
import { MdOutlineGridOn } from "react-icons/md";
import { Routes, Route, Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import Posts from './Posts';
import Saved from './Saved';

function Profile() {
    const { user, setUser } = useContext(UserContext);
    const [userObj, setUserObj] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    console.log(state);

    async function getUserData() {
        try {
            const response = await axios.post(`http://localhost:8080/getUser`, {
                username: user
            })
            console.log(response.data);
            if (response.status == 200) setUserObj(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (location.state && location.state.userObj) setUserObj(location.state.userObj);
        else {
            getUserData();
            if (location.pathname.includes("posts")) navigate('/profile/posts', { state: userObj });
        }
    }, [])

    return (<div className='flex justify-center gap-4 flex-col items-center'>

        <div className='flex gap-4 p-4'>
            <div>
                <img src="https://avatar.iran.liara.run/public/boy" className='w-32' />
            </div>

            <div>
                <div className='flex gap-2 items-center'>
                    <p>{userObj.name}</p>
                    {user == userObj.name && <>
                        <button className='font-bold bg-[#454444] p-2 rounded-lg text-sm'>Edit Profile</button>
                        <div className='text-xl'><RiSettings3Fill /></div>
                    </>}
                </div>
                <div className='flex gap-2'>
                    <p>{userObj?.posts?.length} posts</p>
                    <p onClick={() =>
                        navigate('/list', {
                            state: { list: userObj?.followers },
                        })}>{userObj?.followers?.length} followers</p>

                    <p onClick={() =>
                        navigate('/list', {
                            state: { list: userObj?.following },
                        })}>{userObj?.following?.length} following</p>
                </div>
                <div>Bio { }</div>
                {user != userObj.name &&
                    <div className='flex gap-2 pt-4'>
                        <div className='bg-[#363636] p-2 rounded-md text-sm cursor-pointer'>Message</div>
                        <div className='bg-[#1977F2] p-2 rounded-md text-sm cursor-pointer'>Follow</div>
                    </div>
                }
            </div>
        </div>


        <div className='w-full'>
            <hr className="border-t-1 border-[#262626]" />
            <div className='flex items-center flex-col'>
                <div className='flex gap-8'>
                    <div className='flex gap-2 items-center text-sm'>
                        <MdOutlineGridOn />
                        <Link to="/profile/posts" state={userObj} className="hover:text-gray-400">POSTS</Link>
                    </div>

                    {user === userObj.name && <div className='flex gap-2 items-center text-sm'>
                        <CiBookmark />
                        <Link to="/profile/saved" state={userObj} className="hover:text-gray-400">SAVED</Link>
                    </div>}
                </div>
            </div>
            <Routes>
                <Route path="/posts" element={<Posts />} />
                <Route path="/saved" element={<Saved />} />
            </Routes>
        </div>

    </div >)
}
export default Profile;