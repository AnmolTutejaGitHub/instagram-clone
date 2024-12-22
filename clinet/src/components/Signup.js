import { useContext, useState } from 'react';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GrInstagram } from "react-icons/gr";

function Signup() {
    const [EnteredUser, setEnteredUser] = useState('');
    const [EnteredEmail, setEnteredEmail] = useState('');
    const [EnteredPassword, setEnteredPassword] = useState('');
    const [Error, setError] = useState('');
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    async function SignUp() {
        const notify = () => toast.success("Sign up Successful!");
        try {
            const response = await axios.post(`http://localhost:8080/signups`, {
                email: EnteredEmail,
                password: EnteredPassword,
                name: EnteredUser
            });

            if (response.status === 200) {
                const token = response.data.token;
                localStorage.setItem('token', token);

                notify();

                setTimeout(() => {
                    navigate("/");
                }, 2000);

            }
        } catch (error) {
            setError(error?.response?.data?.error || "Some error Occurred");
        }
    }

    return (
        <div className="flex justify-center items-center">
            <ToastContainer />
            <div className='mt-[12%] w-[400px]'>
                <form className='p-[2rem] rounded-[5px] flex gap-[1rem] flex-col' onSubmit={(e) => { e.preventDefault(); SignUp(); }}>
                    <div className='flex justify-center'>
                        <GrInstagram className="text-4xl" />
                    </div>
                    <div className='flex items-center gap-2 pl-2'> <p className='text-[30px] font-bold '>Create Your Account </p></div>
                    <input placeholder="Enter Username" onChange={(e) => { setEnteredUser(e.target.value) }} className='p-[0.6rem] outline-none w-full bg-inherit border-[1.7px] border-[#333639] focus:border-[#DA2877] placeholder:text-[#71767A]' required></input>
                    <input placeholder="Enter Email" onChange={(e) => { setEnteredEmail(e.target.value) }} className='p-[0.6rem] outline-none w-full bg-inherit border-[1.7px] border-[#333639] focus:border-[#DA2877] placeholder:text-[#71767A]' required></input>
                    <input placeholder="Set Password" onChange={(e) => { setEnteredPassword(e.target.value) }} className='p-[0.6rem] outline-none w-full bg-inherit border-[1.7px] border-[#333639] focus:border-[#DA2877] placeholder:text-[#71767A]' required></input>
                    <p>Already have an Account ? <span><Link to="/" className='text-[#DA2877]'>Login</Link></span></p>
                    <button className='bg-pink-600 rounded-sm p-2' type="submit">Sign Up</button>
                    {Error && <p className='text-red-600'>*{Error}</p>}
                </form>
            </div>
        </div>
    );
}

export default Signup;