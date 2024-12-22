import { useState } from "react";
import { MdMail } from "react-icons/md";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import UserContext from '../context/UserContext';
import { useEffect } from "react";
import { ColorRing } from 'react-loader-spinner';
import { LuMessageCircleMore } from "react-icons/lu";

function Message() {
    const [EnteredUsername, setUsername] = useState('');
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [friends, setFriends] = useState([]);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        fetchFriends();
    }, [user])
    async function getSearchedUserId(name) {
        try {
            const response = await axios.post(`http://localhost:8080/findUser`, {
                searchUser: name
            });

            return response.data;

        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async function EstablishDM() {
        const receiver = EnteredUsername;
        const receiver_id = await getSearchedUserId(EnteredUsername);
        const sender_id = await getSearchedUserId(user);

        if (receiver_id && sender_id) {
            const room = sender_id + receiver_id;

            const sortedRoomName = room.split('').sort().join('');

            await axios.post(`http://localhost:8080/createOrGetDMRoom`, {
                room_name: sortedRoomName,
                receiver,
                sender: user
            });

            const roomData = {
                sender: user,
                receiver: receiver,
                room: sortedRoomName
            }

            await fetchFriends();

            navigate(`/DMroom`, { state: roomData });
        }

        else {
            setError('username does not exist in database');
        }

        setUsername('');
    }

    async function fetchFriends() {
        try {
            const response = await axios.post(`http://localhost:8080/getFriends`, {
                user: user
            })
            setFriends(response.data);
            setloading(false);
        } catch (e) { }

    }

    const renderFriends = friends.filter((friend) => friend !== user).map((friend, index) => (
        <div key={index} onClick={() => { handleFriendClick(friend) }} className="flex gap-2 items-center hover:bg-[#16181C] p-3">
            <img src={`https://avatar.iran.liara.run/public/boy`} className="rounded-full h-[40px]" />
            <p>{user === friend ? "myself" : friend}</p>
        </div >
    ));

    async function handleFriendClick(friend) {

        const receiver_id = await getSearchedUserId(friend);
        const sender_id = await getSearchedUserId(user);

        const room = sender_id + receiver_id;
        const sortedRoomName = room.split('').sort().join('');

        const roomData = {
            sender: user,
            receiver: friend,
            room: sortedRoomName
        }
        navigate(`/DMroom`, { state: roomData });
    }



    return (<div className="">
        <div className="flex items-center p-4 text-xl gap-2 pt-8">
            <div>Messages</div>
            <LuMessageCircleMore />
        </div>
        <div className="flex justify-center">
            <input placeholder="Search Direct Messages..." className="outline-none p-2 w-[90%] mt-2 rounded-md bg-[#363636]"
                onChange={(e) => setUsername(e.target.value)} value={EnteredUsername}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        EstablishDM();
                    }
                }}
            />
        </div>
        {error && <p className="text-red-600">*{error}</p>}
        {friends.length > 0 && <div className="flex flex-col p-4">{renderFriends}</div>}
        {friends.length == 0 && <div className="text-center pt-4">Search someone to start a conversation with them</div>}
    </div>)
}
export default Message;