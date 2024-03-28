import React, { useState, useEffect, useRef } from 'react';
import config from '../../config';
import WebcamWithGuide from '../../components/webcam-with-guide';
import FaceDetection from '../../components/face-detection';
import 'react-calendar/dist/Calendar.css';
import FormBox from '../../components/form-box';



const TryOnHairstyle = () => {
  //---------------------------- state variable -------------------------------//
  const [currentStep, setCurrentStep] = useState(1);
  const [creationStatus, setCreationStatus] = useState(true); //temp
  const [selectedImage, setSelectedImage] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceDetector, setFaceDetector] = useState(new FaceDetection(setFaceDetected));
  const webcamRef = useRef(null);
  const totalSteps = 5;
  useEffect(() =>{
    faceDetector.initializeFaceDetector("IMAGE");
  },[])
  //---------------------------- options for hairstyle customization -------------------------------//
  const [tryOnOptionCategories, setTryOnOptionCategories] = useState([]);
  const [tryOnOptions,setTryOnOptions] = useState([]);

  //---------------------------- remote option api request -------------------------------//
  const fetchTryOnData = async () => {
    try {

      const optionsResponse = await fetch(config.serverUrl + `/try-on/options?enabled=1`, {
        credentials: 'include'
      });

      const optionsData = await optionsResponse.json();
      if (optionsResponse.ok) {
        setTryOnOptions(optionsData.result);
      } else {
        console.error('Failed to fetch try-on option information:', optionsData.message);
        return;
      }

      const categoriesResponse = await fetch(config.serverUrl + `/try-on/categories`, {
        credentials: 'include'
      });
      const categoriesData = await categoriesResponse.json();
      if (categoriesResponse.ok) {
        const mappedCategories = categoriesData.result.map(category => ({
          value: category.id,
          label: category.name
        }));
        setTryOnOptionCategories(mappedCategories);
      } else {
        console.error('Failed to fetch try-on category information:', categoriesData.message);
      }

    } catch (error) {
      console.error('Error fetching salon data:', error);
      //setLoading(false);
    }
  }
  //---------------------------- remote api request submit image and prompt -------------------------------//
  const generateResult = async () => {
    
  }
  
  
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
    setFaceDetected(false);
  }
  
  // handle drag and drop OR file upload
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFiles(files);
  };
  const handleFiles = (files) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const file = files[0];

    // Check file type
    if (!validTypes.includes(file.type)) {
        alert('Please upload a PNG, JPG, or JPEG image file only.');
        return;
    }

    // Check file size
    const maxSize = 1024 * 1024 * 5; // 5MB
    if (file.size > maxSize) {
        alert('File size exceeds the limit of 1MB. Please upload a smaller image.');
        return;
    }

    // Resize image to 512x512
    const resizeImage = (image) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        ctx.drawImage(image, 0, 0, 512, 512);
        return canvas.toDataURL('image/jpeg');
    };

    const reader = new FileReader();
    reader.onload = () => {
        const img = new Image();
        img.onload = async () => {
            const resizedDataURL = resizeImage(img);
            setSelectedImage(resizedDataURL);
            setFaceDetected(await faceDetector.imageDetection(resizedDataURL));
            handleNextStep();
        };
        img.src = reader.result;
    };
    reader.readAsDataURL(file);
};


  //button to replace input elememt
  const fileInputRef = useRef(null);

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };
  //---------------------------- helper and formatting method -------------------------------//

  //---------------------------- html -------------------------------//
  return (
    <div className="container-fluid my-3 full-width">
      <div className='border border-2 rounded-4 p-4 ps-5 bg-white min-height mb-4'>
        <div className="progress mb-4">
          <div className={`progress-bar ${currentStep === totalSteps + 1 ? 'bg-success' : ''}`} role="progressbar" style={{ width: `${(currentStep - 1) / totalSteps * 100}%` }} aria-valuenow={(currentStep - 1) / totalSteps * 100} aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        {/* Step content */}
        <div>
          <div className='border border-2 rounded-4 p-4 ps-5 bg-white min-height mb-4'>
            {/* Step 1 content */}
            {currentStep === 1 && (
              <div className='mb-5'>
                <h2 className='text-start'>Take a Valid Selfie Or Select an Valid Image</h2>
                <div className='step-content d-flex justify-content-center row'>
                  <div className='col-5'>
                    <FormBox className={'responsive-tab'} onClick={handleFileUpload}>
                      <div className='p-5' onDrop={handleDrop} onDragOver={handleDragOver}>
                      <span className='bi bi-image px-5 icon-xl text-secondary '></span>
                      <p className='fs-4 text-secondary fw-semibold'>Drag and drop image file</p>
                      <input type='file' accept='.png,.jpg,.jpeg' className='form-control d-none' ref={fileInputRef} onChange={(e) => handleFiles(e.target.files)} />
                      <button className='btn btn-lg btn-secondary' onClick={handleFileUpload}><span className='bi bi-upload me-2'></span> Choose File</button>
                      </div>
                    </FormBox>
                  </div>
                  <div className='col-5'>
                  <FormBox className={'responsive-tab'} onClick={handleNextStep}>
                      <div className='p-5'>
                      <span className='bi bi-camera px-5 icon-xl text-primary'></span>
                      <p className='fs-4 text-secondary fw-semibold'>Take a Selfie</p>
                      <button className='btn btn-lg btn-primary' onClick={handleNextStep}><span className='bi bi-camera-video me-2'></span> Take Image</button>
                      </div>
                    </FormBox>
                  </div>
                </div>
              </div>
            )}
            {/* Step 2 content */}
            {currentStep === 2 && (
              <div>
                {selectedImage ?
                <h2 className='text-start'>Capturing Image using Webcam</h2>
                :
                <h2 className='text-start'>Image Preview</h2>
                }
                <div className='step-content d-flex justify-content-center mt-5'>
                  {selectedImage ? (
                    <div className={`border border-5 p-3 ${faceDetected?'border-success': 'border-danger'}`}>
                      <h3 className={`${faceDetected?'text-dark': 'text-danger'}`}>{faceDetected?'Preview':'No Face Detected In The Image'} </h3>
                      <img src={selectedImage} alt="Selected" className="selected-image" />
                      <div className="mt-4">
                        <button onClick={() => { resetSelectedImage(); handlePrevStep(); }} className='btn btn-lg btn-primary me-4'>Retake Image</button>
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
            {currentStep === 3 && (
              <div>
                <h2 className='text-start'>Virtual Hairstyle</h2>
                <div className='step-content d-flex justify-content-center'>
                <div className='col-5 mb-5'>
                    <FormBox className={'responsive-tab'}>
                      <div className='p-5'>
                      <span className='bi bi-rocket-fill px-5 icon-xl text-success '></span>
                      <p className='fs-4 text-secondary fw-semibold'>Select Recommended Hairstyle</p>
                      </div>
                    </FormBox>
                  </div>
                  <div className='col-5'>
                  <FormBox className={'responsive-tab'}>
                      <div className='p-5'>
                      <span className='bi bi-palette-fill px-5 icon-xl text-warning'></span>
                      <p className='fs-4 text-secondary fw-semibold'>Customize Your Own Hairstyle</p>
                      </div>
                    </FormBox>
                  </div>
                </div>
              </div>
            )}
            {/* Step 4 content */}
            {currentStep === 4 && (
              <div>
                <h2 className='text-start'>Custom Hairstyle Options</h2>
                <div className='step-content d-flex justify-content-center mt-5'>
                </div>
              </div>
            )}
            {/* Step 5 content */}
            {currentStep === 5 && (
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
        {currentStep <= totalSteps && currentStep > 2 && (
          <div className={`d-flex justify-content-between`}>
            {/* Prev button */}
            <button className="btn btn-lg btn-secondary me-3" onClick={handlePrevStep}>Prev Step</button>
            {/* Next/Complete button */}
            {currentStep !== totalSteps ? (
              <button className="btn btn-lg btn-primary" onClick={handleNextStep}>Next Step</button>
            ) : (
              <button className="btn btn-lg btn-success" onClick={handleComplete}>Complete</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TryOnHairstyle;
