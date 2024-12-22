import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GrInstagram } from "react-icons/gr";

function OTPValidation() {
    const notify = () => toast.success("Otp sent Successfully!");
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || '';

    const [enteredOTP, setEnteredOTP] = useState('');
    const [sentOTP, setSentOTP] = useState('');
    const [error, setError] = useState('');
    const [otpSending, setSending] = useState(false);

    useEffect(() => {
        if (!email || email.trim() === '') navigate("/");
    }, []);

    async function sendOTP() {
        try {
            setSending(true);
            const otp = generateOTP();
            setSentOTP(otp);

            await axios.post(`http://localhost:8080/otp`, { email, otp });
            setError("");
            notify();
        } catch (e) {
            setError("Error sending OTP");
        } finally {
            setSending(false);
        }
    }

    async function validateOTP() {
        if (enteredOTP === '') return;
        if (sentOTP === enteredOTP) {
            navigate("/home");
        } else {
            setError("Invalid OTP");
        }
    }

    function generateOTP() {
        let otp = '';
        for (let i = 0; i < 4; i++) {
            const digit = Math.floor(Math.random() * 10);
            otp += digit.toString();
        }
        return otp;
    }

    return (
        <div className="flex justify-center items-center">
            <ToastContainer />
            <div className="mt-[12%] w-[400px]">
                <div>
                    <form className='p-[2rem] rounded-[5px] flex gap-[1rem] flex-col'>
                        <div className='flex items-center gap-4 pl-2'> <p className='text-[35px] font-bold'>OTP Validation</p>
                            <GrInstagram className="text-4xl" />
                        </div>

                        <input
                            placeholder="Enter OTP"
                            value={enteredOTP}
                            onChange={(e) => setEnteredOTP(e.target.value)}
                            className='p-[0.6rem] outline-none w-full bg-inherit border-[1.7px] border-[#333639] focus:border-[#DA2877] placeholder:text-[#71767A]'
                        />
                        <button onClick={sendOTP} disabled={otpSending} className="p-2 bg-pink-600 rounded-sm">Generate OTP</button>
                        <button onClick={validateOTP} className="p-2 bg-pink-600 rounded-sm">Validate OTP</button>
                        {error && <p className="text-red-600">*{error}</p>}
                        {otpSending && <p>sending...</p>}
                    </form>

                </div>
            </div>
        </div>
    );
}

export default OTPValidation;