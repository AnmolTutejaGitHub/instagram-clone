import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    async function getUserNotifications() {
        const response = await axios.post(`http://localhost:8080/getUserNotifications`, {
            username: user
        });
        setNotifications(response.data);
        console.log(response.data);
    }

    useEffect(() => {
        getUserNotifications();
    }, [])

    const renderNotifications = notifications.map((noti) => {
        return <div className='flex gap-2 items-center'>
            <img src="https://avatar.iran.liara.run/public/boy" className='w-8' />
            <div className='text-pink-700 cursor-pointer' onClick={() => navigate(`/profile?searchuser=${noti.sender}`)}>{noti.sender} </div>
            <div>{noti.message}</div>
            <div className='text-orange-500 cursor-pointer' onClick={() => navigate(`/post?postid=${noti.refId}`)}>{noti.refId}</div>
            <div className=' text-sm'>at {noti.createdAt}</div>
        </div>
    })

    return (<div className='flex flex-col gap-3 p-4'>
        {renderNotifications}
        {notifications.length === 0 && <>
            <div className='text-center'>No Notifications Available</div>
            <div className='text-center'>You will receive a notification when someone liked/commented on Your Post</div>
        </>}
    </div>)
}
export default Notification;