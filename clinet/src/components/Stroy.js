import { useState, useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';
import { TbWorldUpload } from "react-icons/tb";
import toast, { Toaster } from 'react-hot-toast';


function Story() {
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
        formData.append('storyfile', file);
        formData.append('username', user);

        try {
            const response = await fetch(`http://localhost:8080/storyupload`, {
                method: 'POST',
                body: formData
            });

            toast.success('Uploaded!');
            const responseData = await response.json();
            console.log(responseData);

        } catch (error) {
            toast.error('An error occurred');
            console.error("Error during file upload:", error);
        } finally {
            toast.dismiss(toastId);
        }
    }

    return (
        <div className="bg-[#D9D9D9] h-[50vh] w-[50vw] rounded-md p-4 flex items-center justify-center shadow-lg">
            <div className="p-8 border-dotted border-2 border-blue-600 rounded-md bg-[#D9D9D9]">
                <form
                    encType="multipart/form-data"
                    className="uploadform flex gap-4 items-center"
                    onSubmit={(e) => handleFileSubmit(e)}
                >
                    <input
                        type="file"
                        name="uploadfile"
                        id="uploadfile"
                        required
                        className="hidden"
                    />
                    <label
                        htmlFor="uploadfile"
                        className="text-blue-600 text-3xl cursor-pointer hover:scale-110 transition-transform"
                    >
                        <TbWorldUpload />
                    </label>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
                    >
                        Create
                    </button>
                </form>
            </div>
        </div>)
}
export default Story;