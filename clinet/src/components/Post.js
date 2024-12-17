import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from 'axios';
import { IoIosHeartEmpty } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import UserContext from '../context/UserContext';
import { FaHeart } from "react-icons/fa";
import { GoBookmarkSlash } from "react-icons/go";
import toast, { Toaster } from 'react-hot-toast';

function Post() {
    const [searchParams] = useSearchParams();
    const postid = searchParams.get("postid");
    const [post, setPost] = useState({});
    const { user, setUser } = useContext(UserContext);
    const [isLiked, setIsLiked] = useState(false);
    const [Comment, setComment] = useState('');
    const [saved, setSaved] = useState(false);
    const [creator, setCreator] = useState(false);
    const [caption, setCaption] = useState('');
    const [isDisable, setDisable] = useState(true);

    async function getPost() {
        try {
            const response = await axios.post(`http://localhost:8080/getPost`, {
                postid: postid
            })
            setPost(response.data);
            if (response.data.user == user) setCreator(true);
            if (response.data.user == user) setDisable(false);

        } catch (e) {
            console.log("Post does not exist");
            console.log(e);
        }
    }

    async function likePost() {
        const response = await axios.post(`http://localhost:8080/likePost`, {
            postid: postid,
            username: user
        })
        post.likes.push(user);
        setIsLiked(true);
    }

    async function wasLiked() {
        try {
            const response = await axios.post(`http://localhost:8080/wasLiked`, {
                postid: postid,
                username: user
            })
            setIsLiked(true);
        } catch (e) { }
    }

    async function unlikePost() {
        const response = await axios.post(`http://localhost:8080/unlikepost`, {
            postid: post._id,
            username: user
        })
        setPost(response.data);
        setIsLiked(false);
    }


    async function savePost() {
        const response = await axios.post(`http://localhost:8080/savePost`, {
            postid: postid,
            username: user
        })
        setSaved(true);
    }

    async function unSavePost() {
        const response = await axios.post(`http://localhost:8080/unSavePost`, {
            postid: postid,
            username: user
        })
        setSaved(false);
    }

    async function wasSaved() {
        try {
            const response = await axios.post(`http://localhost:8080/wasSaved`, {
                postid: postid,
                username: user
            })
            setSaved(true);
        } catch (e) {
            console.log(e);
        }
    }

    async function EditCaption() {
        const toastId = toast.loading('Editing...');
        try {
            const response = await axios.post(`http://localhost:8080/editCaption`, {
                postid: postid,
                caption: caption
            })
            toast.success('Edited!');
        } catch (e) {
            toast.error('An error occurred');
            console.log(e);
        } finally {
            toast.dismiss(toastId);
        }
    }

    useEffect(() => {
        getData();
    }, [])

    async function getData() {
        await getPost();
        await wasLiked();
        await wasSaved();
    }

    return (
        <div className='p-2 flex flex-row  gap-2'>
            <div className='p-4 border-t border-b border-[#262626] flex gap-3 flex-col w-[50%]'>
                <div className='flex flex-row justify-between'>
                    <p>{post.user}</p>
                    <p className='text-[#A8A8A8]'>{post.createdAt}</p>
                </div>
                <img src={post.url} className='w-auto rounded-sm border-1 border-[#262626] max-h-[60%]' />
                <div className='flex gap-4 text-[25px] text-[#A8A8A8]'>
                    {!isLiked && <IoIosHeartEmpty onClick={likePost} />}
                    {isLiked && <FaHeart className="text-red-500" onClick={unlikePost} />}
                    <div className='text-[23px]'>
                        <FaRegComment />
                    </div>
                    <div className='text-[23px]'>
                        {!saved && <CiBookmark onClick={savePost} />}
                        {saved && <GoBookmarkSlash onClick={unSavePost} />}
                    </div>
                </div>
                <div>{post.likes?.length} likes</div>

                <div className="flex gap-2">
                    <input className={`bg-inherit outline-none ${creator ? 'border-b border-white w-[95%]' : ''}`} defaultValue={post.caption} onChange={(e) => setCaption(e.target.value)} disabled={isDisable}></input>
                    {creator &&
                        <button onClick={EditCaption}>Edit</button>}
                </div>

            </div>
            <div className="w-[50%]">
                <div className="flex gap-1 pl-2">
                    <div>{post.comments?.length}</div>
                    <div>Comments</div>
                </div>
                <div className="flex gap-4 p-2">
                    <input placeholder="Add a comment..." className="bg-inherit border-b border-white w-full outline-none" value={Comment} onChange={(e) => setComment(e.target.value)} />
                    <button className={` cursor-pointer ${Comment === '' ? 'text-blue-200' : 'text-blue-400'}`} disabled >post</button>
                </div>
                <div></div>
            </div>
        </div >)
}
export default Post;