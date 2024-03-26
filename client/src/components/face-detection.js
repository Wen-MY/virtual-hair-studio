import React, { Component } from 'react';
import { FilesetResolver, FaceDetector } from '@mediapipe/tasks-vision';

class FaceDetection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            runningMode: 'IMAGE', //default is image
        };
        this.faceDetector = null;
    }
    async initializeFaceDetector(runningMode) {
        try {
            const vision = await FilesetResolver.forVisionTasks(
                'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
            );

            this.faceDetector = await FaceDetector.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
                    delegate: 'GPU'
                },
                runningMode: runningMode
            });

            if (this.faceDetector) {
                console.log("Face detector initialized");
            } else {
                console.log("Face detector initialization failed");
            }
        } catch (error) {
            console.error("Error in initializing face detector:", error);
        }
    }

    imageDetection = async (imageSrc) => {
        if (!this.faceDetector) {
            console.log('FaceDetector not initialized');
            return false;
        }
    
        try {
            // Create an Image object
            const image = new Image();
    
            // Set the image source
            image.src = imageSrc;
    
            // Wait for the image to load
            await new Promise((resolve, reject) => {
                image.onload = resolve;
                image.onerror = reject;
            });
    
            // Perform face detection using the loaded image
            const detections = this.faceDetector.detect(image).detections;
            console.log(detections);
            return (detections.length > 0);
        } catch (error) {
            console.error('Error during face detection:', error);
            return false;
        }
    };
    
    
    
}

export default FaceDetection;
