import { useLocation } from 'react-router-dom';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/css';

function UserStories() {
    const location = useLocation();
    const stories = location.state;
    console.log(location.state);

    const renderStories = stories.stories.map((stry, index) => {
        return <SplideSlide key={index}>
            <div className="flex justify-center items-center h-screen">
                <video
                    src={stry.url}
                    className="w-96 max-w-full rounded-lg shadow-lg"
                    controls
                    // autoPlay
                    loop
                />
            </div>
        </SplideSlide>
    })
    return <div>
        <Splide
            options={{
                height: '90vh',
                wheel: true,
                drag: true,
                arrows: false,
                rewind: true,
            }}
        >
            {renderStories}
        </Splide>
    </div>
}
export default UserStories;