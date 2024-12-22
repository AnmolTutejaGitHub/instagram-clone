import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GrInstagram } from "react-icons/gr";

function ForgetPassword() {
    const [enteredOTP, setEnteredOTP] = useState('');
    const [generatedotp, setgeneratedotp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const notify = (text) => toast.success(text);

    function reset() {

    }

    function generateOTP() {
        let otp = '';
        for (let i = 0; i < 4; i++) {
            const digit = Math.floor(Math.random() * 10);
            otp += digit.toString();
        }
        return otp;
    }

    async function sendOTP(e) {
        e.preventDefault();
        const newOTP = generateOTP();
        try {
            await axios.post(`http://localhost:8080/otp`, { email, otp: newOTP });
            setError("");
            setgeneratedotp(newOTP);
            notify("Otp sent Successfully!");
        } catch (e) {
            setError("Error sending OTP");
        }
    }

    async function reset(e) {
        e.preventDefault();
        setError('');

        if (!email.trim()) return setError('please Enter Email');
        if (!generatedotp.trim()) return setError('OTP verification failed');
        if (!enteredOTP.trim()) return setError('Please enter the OTP code');
        if (!password.trim()) return setError('Please enter a new password');
        if (enteredOTP.trim() != generatedotp) return setError("OTP doesn't match");

        try {
            const response = await axios.post(`http://localhost:8080/resetpassword`, {
                email,
                password
            });

            notify('Password reset successful');
            setPassword('');
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.log(error);
            if (error?.response?.data?.message) setError(error?.response?.data?.message);
            else if (error?.response?.data?.error) setError(error.response.data.error);
            else setError('Error resetting password');
        }
    }

    return (
        <div className="flex justify-center items-center">
            <ToastContainer />
            <div className='mt-[12%] w-[400px]'>
                <form className='p-[2rem] rounded-[5px] flex gap-[1rem] flex-col'>
                    <div className='flex justify-center'>
                        <GrInstagram className="text-5xl" />
                    </div>
                    <div className='flex items-center gap-2 pl-2'> <p className='text-[30px] font-bold'>Reset Your Password</p></div>
                    <input placeholder="Enter Email" className='p-[0.6rem] outline-none w-full bg-inherit border-[1.7px] border-[#333639] focus:border-[#DA2877] placeholder:text-[#71767A]' onChange={(e) => setEmail(e.target.value)} required></input>
                    <button className='bg-pink-600 rounded-sm p-2' onClick={sendOTP}>Send OTP</button>
                    <input placeholder="Enter OTP" className='p-[0.6rem] outline-none w-full bg-inherit border-[1.7px] border-[#333639] focus:border-[#DA2877] placeholder:text-[#71767A]' onChange={(e) => setEnteredOTP(e.target.value)}></input>
                    <input placeholder="Enter New Password" className='p-[0.6rem] outline-none w-full bg-inherit border-[1.7px] border-[#333639] focus:border-[#DA2877] placeholder:text-[#71767A]' onChange={(e) => setPassword(e.target.value)} ></input>
                    <button type="submit" className='bg-pink-600 rounded-sm p-2' onClick={(e) => reset(e)}>Reset</button>
                    {error && <p className="text-red-600">*{error}</p>}
                </form>
            </div>
        </div>
    );
}
export default ForgetPassword;