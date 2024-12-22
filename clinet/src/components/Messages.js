import { useContext } from 'react';
import UserContext from '../context/UserContext';

function Messages({ _key, timestamp, username, msg }) {
    const { user, setUser } = useContext(UserContext);
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const parseMessage = (message) => {
        return message.split(urlRegex).map((part, index) => {
            if (urlRegex.test(part)) {
                return <a className="msg-url" key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
            }
            return part;
        });
    };
    return (
        <div className={`flex ${username == user ? `justify-end` : `justify-start`}`}>
            <div className="" key={_key}>
                <div className='flex flex-row gap-4'>
                    <img src={`https://avatar.iran.liara.run/public/boy`} className="rounded-full h-10" />
                    <div className={`${username == user ? `bg-[#1C9BEF]` : `bg-[#2F3336]`} p-2 inline-block overflow-hidden break-words rounded-lg text-center`}>
                        {parseMessage(msg)}
                    </div>
                    <div className="text-[#71767A] text-[12px]" >{timestamp}</div>
                </div>
            </div>
        </div>);
}

export default Messages;