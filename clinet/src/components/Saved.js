import { useState, useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Saved() {
    const [posts, setposts] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    async function getSavedpost() {
        const response = await axios.post(`http://localhost:8080/getSavedPost`, {
            username: user
        })
        console.log(response.data);
        setposts(response.data);
    }

    useEffect(() => {
        getSavedpost();
    }, [])


    const renderPosts = posts.map((postid) => {
        return <div className='flex justify-center'>
            <div onClick={() => navigate(`/post?postid=${postid}`)}>{postid}</div>
        </div>
    })


    return (
        <div className='pt-4 text-orange-600 cursor-pointer'>{renderPosts}</div>
    )
}
export default Saved;