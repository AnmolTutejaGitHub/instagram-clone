import axios from 'axios';
import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import UserContext from '../context/UserContext';

function List() {
    // const location = useLocation();
    // const { list } = location.state;
    const [searchParams] = useSearchParams();
    const searchuser = searchParams.get("searchuser");
    const followerlist = searchParams.get("followerlist");
    const bool_followerlist = followerlist.toLowerCase() === "true";
    const [list, setList] = useState([]);
    const { user, setUser } = useContext(UserContext);

    async function getList() {
        const response = await axios.post(`http://localhost:8080/getList`, {
            username: searchuser,
            followerlist: bool_followerlist
        })
        setList(response.data);
    }

    useEffect(() => {
        getList();
    }, [])

    const renderList = list.map((ls) => {
        return (
            <div className="flex gap-10 justify-around">
                <p>{ls}</p>
                {user == searchuser && <button className="bg-[#474747] p-2 pt-1 pb-2 rounded-lg">remove</button>}
            </div>)
    })
    return (<div className=" bg-black h-full flex justify-center items-center">
        <div className=" pt-20 rounded-xl w-[25%] h-[50%] bg-[#262626] relative">
            {/* <div className="absolute top-2 right-2 cursor-pointer" onClick={() => window.history.back()}> <IoMdClose /></div> */}
            <div className="flex flex-col gap-2 p-4">{renderList}</div>
        </div>
    </div>);
}
export default List;