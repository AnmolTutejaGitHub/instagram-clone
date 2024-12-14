import { TbWorldUpload } from "react-icons/tb";
import { useEffect, useState, useContext } from 'react';
import { useLocation } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import UserContext from '../context/UserContext';
import axios from 'axios';

function Post() {
    const location = useLocation();
    const userObj = location.state;
    const [posts, setPosts] = useState([]);
    const { user, setUser } = useContext(UserContext);

    async function handleFileSubmit(e) {
        e.preventDefault();
        const toastId = toast.loading('Posting...');

        const fileInput = document.getElementById('uploadfile');
        const file = fileInput.files[0];
        console.log(file);

        if (!file) {
            console.log("No file selected")
            return;
        }

        const formData = new FormData();
        formData.append('uploadfile', file);
        formData.append('username', userObj?.name);

        try {
            const response = await fetch(`http://localhost:8080/fileupload`, {
                method: 'POST',
                body: formData
            });

            toast.success('Uploaded!');
        } catch (error) {
            toast.error('An error occurred');
            console.error("Error during file upload:", error);
        } finally {
            toast.dismiss(toastId);
        }
    }



    async function GetUserPosts() {
        const response = await axios.post(`http://localhost:8080/getUserPosts`, {
            username: userObj?.name
        })
        setPosts(response.data);
    }

    useEffect(() => {
        GetUserPosts();
    })

    const renderPosts = posts.map((post) => {
        return (<img src={post.url} className="w-48"></img>)
    })


    return (<div className="flex justify-center items-center flex-col">

        {user == userObj.name && <div className="p-2">
            <form onSubmit={(e) => handleFileSubmit(e)} encType="multipart/form-data" className="uploadform flex gap-2 items-center">
                <input type="file" name="uploadfile" id="uploadfile" required className="hidden" />
                <label for="uploadfile"><TbWorldUpload /></label>
                <button type="submit">Create</button>
            </form>
        </div>}

        <div className="flex flex-wrap gap-2 justify-center">{renderPosts}</div>
    </div>)
}
export default Post;