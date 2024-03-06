import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

const FaceCapture = () => {
  const videoRef = useRef(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await await Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri('./models/tiny_face_detector')]);
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    const videoEl = videoRef.current;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoEl.srcObject = stream;
        videoEl.play();
      })
      .catch(err => console.error('Error accessing the webcam:', err));

    const detectFace = async () => {
      const result = await faceapi.detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
      setIsFaceDetected(!!result);
    };

    const intervalId = setInterval(detectFace, 1000); // You can adjust the interval for face detection

    return () => clearInterval(intervalId);
  }, []);

  const takeSnapshot = () => {
    // You can add code here to take a snapshot of the video when a face is detected
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
      <video
        ref={videoRef}
        style={{ width: '100%', maxHeight: '400px' }}
      />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
        <img
          src={`${process.env.PUBLIC_URL}/portrait_guide.png`} // Replace with your portrait guide image
          alt="Portrait Guide"
          style={{ width: '100%', opacity: isFaceDetected ? 0.5 : 0 }} // Adjust opacity based on face detection
        />
      </div>
      <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', opacity: isFaceDetected ? 1 : 0.5 }}>
        {isFaceDetected ? 'Face Detected' : 'No Face Detected'}
      </div>
      <button onClick={takeSnapshot} style={{ position: 'absolute', bottom: 10, right: 10 }}>Take Picture</button>
    </div>
  );
};

export default FaceCapture;
