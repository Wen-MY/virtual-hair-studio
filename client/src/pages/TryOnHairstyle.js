import React, { useState, useEffect, useRef } from 'react';
import config from '../config';
import { useNavigate, useLocation } from 'react-router-dom';
import WebcamWithGuide from '../components/webcam-with-guide';
import FaceDetection from '../components/face-detection';
import 'react-calendar/dist/Calendar.css';
import 'react-time-picker/dist/TimePicker.css'



const TryOnHairstyle = () => {
  //---------------------------- state variable -------------------------------//
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [creationStatus, setCreationStatus] = useState(true); //temp
  const [selectedImage, setSelectedImage] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceDetector, setFaceDetector] = useState(new FaceDetection(setFaceDetected));
  const webcamRef = useRef(null);
  const totalSteps = 5;
  useEffect(() =>{
    faceDetector.initializeFaceDetector("IMAGE");
  },[])
  //---------------------------- remote option api request -------------------------------//


  //---------------------------- user interaction handling -------------------------------//
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case 1:
        setCurrentStep(currentStep + 1);
        break;
      case 2:
        setCurrentStep(currentStep + 1);
        break;
      case 3:
        setCurrentStep(currentStep + 1);
        break;
      case 4:
        setCurrentStep(currentStep + 1);
        break;
      default:
        setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = async () => {
    setCurrentStep(currentStep + 1);
  };

  const captureImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSelectedImage(imageSrc);
    setFaceDetected(await faceDetector.imageDetection(imageSrc));
  };

  const resetSelectedImage = () => {
    setSelectedImage(null);
  }

  //handle change input for not null


  //---------------------------- helper and formatting method -------------------------------//

  //---------------------------- html -------------------------------//
  return (
    <div className="container-fluid my-3 full-width">
      <div className='border border-2 rounded-4 p-4 ps-5 bg-white min-height mb-4'>
        <div className="progress mb-4">
          <div className={`progress-bar ${currentStep === totalSteps + 1 ? 'bg-success' : ''}`} role="progressbar" style={{ width: `${(currentStep - 1) / totalSteps * 100}%` }} aria-valuenow={(currentStep - 1) / totalSteps * 100} aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        {/* Step content */}
        <div className="mb-3">
          <div className='border border-2 rounded-4 p-4 ps-5 bg-white min-height mb-4'>
            {/* Step 1 content */}
            {currentStep === 0 && (
              <div>
                <h2 className='step-title text-start'>Term of Use</h2>
                <div className='step-content d-flex justify-content-center mt-5 row mx-5'>
                  {/* Input fields for step 1 */}
                  <div className="mb-3 row overflow-scroll fix-height border border-2 rounded-2 ">
                    <p className=' text-start fs-4 p-5 '>

                      <strong>1. Image Usage Consent</strong> : By using our application and uploading your portrait selfie, you agree to grant us the non-exclusive, worldwide, royalty-free license to collect, store, and analyze your image for application analytics purposes only. We will not use your image for any other purposes without your explicit consent.
                      <br></br><br></br>
                      <strong>  2. Data Security</strong> : We prioritize the security and confidentiality of your personal data, including your portrait selfie. Your image will be securely stored within our application's database and will not be shared with or accessed by any third parties, except for the purpose of analytics as outlined in this agreement.
                      <br></br><br></br>
                      <strong>  3. Anonymity</strong> : We will anonymize your image and dissociate it from any personally identifiable information before using it for analytics. Your privacy is of utmost importance to us, and we will take all necessary measures to ensure that your identity remains protected.
                      <br></br><br></br>
                      <strong>  4. Purpose Limitation</strong> : Your portrait selfie will solely be used for application analytics, including but not limited to user engagement analysis, feature optimization, and demographic insights. We will not use your image for marketing or promotional activities without obtaining your explicit consent.
                      <br></br><br></br>
                      <strong>  5. Data Retention</strong> : We will retain your image for as long as necessary to fulfill the purposes outlined in this agreement. If you choose to delete your account or remove your image from our application, we will promptly delete your image from our database, unless retention is required by law or for legitimate business purposes.
                      <br></br><br></br>
                      <strong>  6. User Control</strong> : You have the right to access, modify, or delete your portrait selfie at any time. You can manage your image preferences through the application settings or by contacting our support team for assistance.
                      <br></br><br></br>
                      <strong>  7. Updates to Terms</strong> : We reserve the right to update or modify these terms of use to reflect changes in our practices or legal requirements. We will notify you of any significant changes to these terms, and your continued use of the application after such modifications constitutes your acceptance of the updated terms.
                      <br></br><br></br>
                      <strong>  8.Usage of image</strong> : By using our application and uploading your portrait selfie, you acknowledge that you have read, understood, and agreed to abide by these terms of use regarding the usage of your image for application analytic purposes.                    
                    </p>
                    <div className='border-top mt-5 fs-5'>
                        <strong>It's important to consult with legal professionals to ensure that the terms of use comply with relevant laws and regulations in your jurisdiction.</strong>
                      </div>
                  </div>
                </div>
              </div>
            )}
            {/* Step 2 content */}
            {currentStep === 1 && (
              <div>
                <h2 className='text-start'>Take a Valid Selfie Or Select an Valid Image</h2>
                <div className='step-content d-flex justify-content-center mt-5'>
                  {selectedImage ? (
                    <div className={`border border-5 p-3 ${faceDetected?'border-success': 'border-danger'}`}>
                      <h3>Preview </h3>
                      <img src={selectedImage} alt="Selected" className="selected-image" />
                      <div className="mt-4">
                        <button onClick={resetSelectedImage} className='btn btn-lg btn-primary me-4'>Retake Image</button>
                        <button onClick={handleNextStep} className={`btn btn-lg ${faceDetected?'btn-success':'btn-secondary'}`} disabled={!faceDetected}>Use This Image</button>
                      </div>
                    </div>
                  )
                    :(
                      <div className={`border border-5 p-3`}>
                        <WebcamWithGuide webcamRef={webcamRef}/>
                        <button onClick={captureImage} className='btn btn-lg btn-primary mt-4'>Capture Image</button>
                      </div>
                    )
                  }
                </div>
              </div>
            )}
            {/* Step 3 content */}
            {currentStep === 2 && (
              <div>
                <h2 className='text-start'>Choose Desired Hairstyle Variation</h2>
                <div className='step-content mt-5 d-flex justify-content-center'>
                </div>
              </div>
            )}
            {/* Step 4 content */}
            {currentStep === 3 && (
              <div>
                <h2 className='text-start'>Choose Hairstyle Options</h2>
                <div className='step-content d-flex justify-content-center mt-5'>
                </div>
              </div>
            )}
            {/* Step 5 content */}
            {currentStep === 4 && (
              <div>
                <h2 className='text-start'>Result Showing</h2>
                <div className='step-content d-flex justify-content-center mt-5'>
                </div>
              </div>
            )}
            {/* Complete content */}
            {currentStep > totalSteps && creationStatus && (
              <div>
                <h2 className='text-start'>Suggesting Salons</h2>
                <div className='step-content d-flex justify-content-center mt-5'>
                </div>
              </div>
            )}
            {/* Step Loading content */}
            {currentStep > totalSteps && creationStatus === null && (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </div>
        </div>
        {currentStep <= totalSteps && currentStep !== 0 && currentStep !== 1 && (
          <div className={`d-flex justify-content-${currentStep === 1 ? 'end' : 'between'}`}>
            {/* Prev button */}
            {currentStep !== 1 && (
              <button className="btn btn-lg btn-secondary me-3" onClick={handlePrevStep}>Prev Step</button>
            )}
            {/* Next/Complete button */}
            {currentStep !== totalSteps ? (
              <button className="btn btn-lg btn-primary" onClick={handleNextStep}>Next Step</button>
            ) : (
              <button className="btn btn-lg btn-success" onClick={handleComplete}>Complete</button>
            )}
          </div>
        )}
        {currentStep === 0 && (
          <div className='d-flex justify-content-center'>
            <button className="btn btn-lg btn-primary me-5" onClick={handleComplete}>Confirm</button>
            <input className='radio'></input>
          </div>
        )}
      </div>
    </div>
  );
};

export default TryOnHairstyle;
