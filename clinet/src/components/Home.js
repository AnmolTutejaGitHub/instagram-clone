import { useNavigate, Route, Routes } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { IoIosHeartEmpty } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import Story from '../components/Stroy';
import { IoMdClose } from "react-icons/io";

function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [userObj, setUserObj] = useState({});
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const notify = () => toast.error("Username doesn't exist");
    const [followingposts, setFollowingposts] = useState([]);
    const [storyComp, setStoryComp] = useState(false);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };

    async function getUserData() {
        try {
            const response = await axios.post(`http://localhost:8080/getUser`, {
                username: user
            })
            console.log(response.data);
            setUserObj(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    async function fetchData() {
        await getUserData();
        await getFollowingPosts();
    }

    useEffect(() => {
        fetchData();
        console.log(followingposts);
    }, [])


    async function handleSearch() {
        try {
            const response = await axios.post(`http://localhost:8080/searchUser`, {
                searchTerm: searchTerm
            });
            const data = response.data;
            setUserObj(data);
            navigate(`/profile?searchuser=${data.name}`); // chanded logic will fix above unnecessay api call later
        } catch (e) {
            notify();
            console.log(e);
        }
    }

    async function getFollowingPosts() {
        const response = await axios.post(`http://localhost:8080/getFollowingPosts`, {
            username: user
        })
        setFollowingposts(response.data);
    }

    const renderFollowingPosts = followingposts.map((post) => {
        const isVideo = post.url.endsWith('.mp4') || post.url.endsWith('.webm');
        if (isVideo) return;
        return <div className='p-4 border-t border-b border-[#262626] flex gap-3 flex-col' onClick={() => navigate(`/post?postid=${post._id}`)}>
            <div className='flex flex-row justify-between'>
                <p>{post.user}</p>
                <p className='text-[#A8A8A8]'>{post.createdAt}</p>
            </div>
            <img src={post.url} className='w-[350px] rounded-sm border-1 border-[#262626]' />
            <div className='flex gap-4 text-[25px] text-[#A8A8A8]'>
                <IoIosHeartEmpty />
                <div className='text-[23px]'>
                    <FaRegComment />
                </div>
                <div className='text-[23px]'>
                    <CiBookmark />
                </div>
            </div>
            <div>{post.likes.length} likes</div>
        </div>
    })


    async function likePost(post) {
        const response = await axios.post(`http://localhost:8080/likePost`, {
            postid: post._id
        })
        post.likes.push(user);
    }


    return (<div>
        {storyComp &&
            <div className="w-[100vw] h-[100vh] fixed z-50 flex justify-center items-center backdrop-blur-md">
                <div className='absolute top-2 right-2' onClick={() => setStoryComp(false)}><IoMdClose /></div>
                <Story />
            </div>
        }
        <Toaster position="top-center" reverseOrder={false} />
        <div className='flex justify-center pt-4 flex-col items-center'>
            <input placeholder="Search" onKeyDown={handleKeyDown} onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm}
                className="p-2 bg-[#363636] rounded-lg outline-none w-[70%] text-[#A8A8A8]"></input>
        </div>

        <div className='p-4 pl-11'>
            <div className='flex absolute'>
                <img
                    src={userObj.profilePicture || `https://avatar.iran.liara.run/public/boy`}
                    className='w-14'
                />
                <FaPlus className='absolute bottom-2 right-[-1px] bg-blue-600 p-1 rounded-xl' onClick={() => setStoryComp(true)} />
            </div>
        </div>

        <div className='p-2 flex flex-col justify-center items-center gap-16'>{renderFollowingPosts}</div>
    </div>)
}
export default Home;