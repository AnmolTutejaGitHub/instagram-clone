import axios from 'axios';
import { useState, useEffect } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/css';

function Reels() {
    const [Reels, setReels] = useState([]);
    async function GetReels() {
        const response = await axios.get(`http://localhost:8080/getReels`);
        setReels(response.data);
    }

    useEffect(() => {
        GetReels();
    }, [])

    const renderReels = Reels.map((reel, index) => {
        return (
            <SplideSlide key={index}>
                <div className="flex justify-center items-center h-screen">
                    <video
                        src={reel.url}
                        className="w-96 max-w-full rounded-lg shadow-lg"
                        controls
                        autoPlay
                        loop
                    />
                </div>
            </SplideSlide>
        );
    });

    return <div>
        <Splide
            options={{
                direction: 'ttb',
                height: '100vh',
                wheel: true,
                pagination: false,
                arrows: false,
                drag: true,
            }}
        >
            {renderReels}
        </Splide>
    </div>
}
export default Reels;