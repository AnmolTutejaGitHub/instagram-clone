import { useNavigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [userObj, setUserObj] = useState({});
    const navigate = useNavigate();

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };
    async function handleSearch() {
        try {
            const response = await axios.post(`http://localhost:8080/searchUser`, {
                searchTerm: searchTerm
            });
            const data = response.data;
            setUserObj(data);
            navigate('/profile', { state: { userObj: data } });
        } catch (e) {
            console.log(e);
        }
    }
    return (<div>
        <input placeholder="search.." className='text-black' onKeyDown={handleKeyDown} onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm}></input>
    </div>)
}
export default Home;