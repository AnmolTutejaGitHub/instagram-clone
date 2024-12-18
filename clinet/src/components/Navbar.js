import { GoHome } from "react-icons/go";
import { BsCameraReels } from "react-icons/bs";
import { AiOutlineMessage } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';

function Navbar() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    return (<div className="flex gap-[8vw] border border-white justify-center p-1 rounded-lg  bottom-3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed bg-black">
        < div className="flex items-center gap-1" onClick={() => navigate('/')}>
            <GoHome />
            <div>Home</div>
        </div >

        <div className="flex items-center gap-1" onClick={() => navigate(`/reels`)}>
            <BsCameraReels />
            <div>Reels</div>
        </div>


        <div className="flex items-center gap-1" onClick={() => navigate(`/messages`)}>
            <AiOutlineMessage />
            <div>Messages</div>
        </div>

        <div className="flex items-center gap-1" onClick={() => navigate(`/notifications`)}>
            <CiHeart />
            <div>Notifications</div>
        </div>

        <div className="flex items-center gap-1" onClick={() => navigate(`/profile?searchuser=${user}`)}>
            <CgProfile />
            <div>Profile</div>
        </div>
    </div >)
}
export default Navbar;