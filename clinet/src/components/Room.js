import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import Messages from "./Messages";
import { useContext } from 'react';
import UserContext from '../context/UserContext';
import axios from 'axios';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useNavigate, useLocation } from 'react-router-dom';

function Room() {
    const SOCKET_SERVER_URL = `http://localhost:8080`;
    const socket = io(SOCKET_SERVER_URL);
    const location = useLocation();
    const roomData = location.state;
    const [enteredValue, setEnteredValue] = useState('');
    const [messages, setMessages] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const renderMessages = messages.map((msg, index) => {
        return <div key={index}>{msg}</div>;
    });

    function sendMessage() {
        socket.emit('SendDMMessage', { room_name: roomData.room, msg: enteredValue, sender: roomData.sender });
        setEnteredValue('');
    }

    useEffect(() => {
        getHistory();
        socket.emit('joinDM', { sender: roomData.sender, receiver: roomData.receiver, room: roomData.room });

        socket.on("DMMessage", (message) => {
            const mess = (
                <Messages _key={new Date()} username={message.sender} timestamp={message.timestamp} msg={message.msg} />
            );
            setMessages((prevMessages) => [...prevMessages, mess]);
        });
        return () => {
            socket.disconnect();
        };
    }, [roomData.room, user]);

    async function getHistory() {
        const response = await axios.post(`http://localhost:8080/roomMessages`, {
            room_name: roomData.room
        });

        if (response.status === 200) {
            const msgs = response.data
                .filter(msgObj => msgObj.username)
                .map((msgObj, index) => (
                    <Messages
                        key={index}
                        username={msgObj.username}
                        timestamp={msgObj.timestamp}
                        msg={msgObj.message}
                    />
                ));
            setMessages(msgs);
        }
    }

    function InputEnterMessageSend(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }

    // function autoResize(e) {
    //     e.target.style.height = 'auto';
    //     e.target.style.height = `${e.target.scrollHeight}px`;
    //     if (enteredValue.trim() === '') e.target.style.height = `42px`;
    // }

    return (<div>
        <div className="text-white text-center font-bold text-[25px] p-2">{roomData.receiver}</div>
        <div className="flex gap-2 justify-center bottom-20 fixed z-[9999] w-full items-center">
            <input type="text" placeholder="Type a message" className="text-white w-[90%] bg-inherit border rounded-md p-2  outline-none h-[42px] resize-none" value={enteredValue} onChange={(e) => setEnteredValue(e.target.value)}
                onKeyPress={InputEnterMessageSend}
            />
            <div onClick={sendMessage} className="font-bold">Send</div>
        </div>
        <ScrollToBottom className="overflow-y-auto h-[100vh]">
            <div className="p-4 pb-24 flex gap-4 flex-col">{renderMessages}</div>
        </ScrollToBottom>
    </div>)
}
export default Room;