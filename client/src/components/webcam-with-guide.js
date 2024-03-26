import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import '../styles/webcam.css'; // Import CSS file for styling
const WebcamWithGuide = ({webcamRef}) => {
    const guideImageSrc = `${process.env.PUBLIC_URL}/person-guide-black.png`;
    const guideImageInverseSrc = `${process.env.PUBLIC_URL}/person-guide-black-inverse.png`;
    const [accessDenied, setAccessDenied] = useState(false);

    useEffect(() => {
        const checkUserMediaAccess = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
            } catch (error) {
                console.error('Error accessing webcam:', error);
                setAccessDenied(true);
            }
        };
        checkUserMediaAccess();

        return () => {
            // Cleanup function
        };
    }, []);

    if (accessDenied) {
        return <div>Error: Access to webcam denied.</div>;
    }
    return (
        <div className='webcam-container'>
            <div className='webcam-guide'>
                <img src={guideImageInverseSrc} alt="Guide" className='guide-image' />
            </div>
            <div className='webcam'>
                <Webcam
                    height={512}
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                        width: 512, // Set width to 512 pixels
                        height: 512, // Set height to 512 pixels
                        facingMode: 'user' // 'environment' for back camera
                    }}
                />
              </div>
        </div>
    );
}

export default WebcamWithGuide;
