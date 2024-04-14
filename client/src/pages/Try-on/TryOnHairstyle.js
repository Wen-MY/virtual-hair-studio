import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import config from '../../config';
import WebcamWithGuide from '../../components/webcam-with-guide';
import FaceDetection from '../../components/face-detection';
import 'react-calendar/dist/Calendar.css';
import FormBox from '../../components/form-box';
import OptionsSections from '../../components/options-section';
import RatingStars from '../../components/rating-star';
import Loader from '../../components/loading-spinner';

const TryOnHairstyle = () => {
  //---------------------------- state variable -------------------------------//
  const [currentStep, setCurrentStep] = useState(1);
  const [creationStatus, setCreationStatus] = useState(true); //temp
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceDetector, setFaceDetector] = useState(new FaceDetection(setFaceDetected));
  const navigate = useNavigate();
  //for hairstyle options customization
  const [customize, setCustomize] = useState(false);
  const [preset, setPreset] = useState(null);
  const [optionShow, setOptionShow] = useState(false);
  const [optionSelected, setOptionSelected] = useState({
    haircut: null,
    color: null,
    texture: null,
    attire: null,
    highlight: null,
    parting: null,
    volume: null,
    accessories: null,
    styling: null,
  })
  const [feedbackOptions, setFeedbackOptions] = useState([]);
  const webcamRef = useRef(null);

  const totalSteps = 5;
  useEffect(() => {
    faceDetector.initializeFaceDetector("IMAGE");
  }, [])
  //---------------------------- options for hairstyle customization -------------------------------//
  const [tryOnOptionCategories, setTryOnOptionCategories] = useState([]);
  const [tryOnOptions, setTryOnOptions] = useState([]);
  const [tryOnRecommendations, setTryOnRecommendations] = useState([]);
  const [tryOnLoading, setLoading] = useState(true);
  //---------------------------- rating state -------------------------------//
  const [rating, setRating] = useState(0);
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

      const feedbackOptionsResponse = await fetch(config.serverUrl + `/try-on/feedback/options`, {
        credentials: 'include'
      });
      const feedbackOptionsData = await feedbackOptionsResponse.json();
      if (feedbackOptionsResponse.ok) {
        setFeedbackOptions(feedbackOptionsData.result);
      } else {
        console.error('Failed to fetch try-on category information:', feedbackOptionsData.message);
      }
    } catch (error) {
      console.error('Error fetching salon data:', error);
      //setLoading(false);
    }
  }
  const fetchRecommendationData = async () => {
    try {
      const recommendationsResponse = await fetch(config.serverUrl + `/try-on/recommendation`, {
        credentials: 'include'
      });

      const recommendationsData = await recommendationsResponse.json();
      if (recommendationsResponse.ok) {
        setTryOnRecommendations(recommendationsData.result);
      } else {
        console.error('Failed to fetch try-on option information:', recommendationsData.message);
        return;
      }

      const feedbackOptionsResponse = await fetch(config.serverUrl + `/try-on/feedback/options`, {
        credentials: 'include'
      });
      const feedbackOptionsData = await feedbackOptionsResponse.json();
      if (feedbackOptionsResponse.ok) {
        setFeedbackOptions(feedbackOptionsData.result);
      } else {
        console.error('Failed to fetch try-on category information:', feedbackOptionsData.message);
      }
    } catch (error) {
      console.error('Error fetching salon data:', error);
      //setLoading(false);
    }
  }
  useEffect(() => {
    if(customize){
      fetchTryOnData();
    }else
    {
      fetchRecommendationData();
    }
  }, [customize])
  //---------------------------- remote api request submit image and prompt -------------------------------//
  const [tryOnResult, setTryOnResult] = useState({
    images_url : [],
    prompt_id : null
  });
  const [feedback, setFeedback] = useState(null);

  const generateTryOnResult = async () => {
    try {
      // Create a new FormData object
      const formData = new FormData();
      let url = config.serverUrl + '/try-on/generate';
      if (feedback !== null) {
        url += `?feedbackId=${feedback}`;
      }
      // Append the selected options to the FormData object
      if(customize)
      {
        formData.append('options', JSON.stringify(optionSelected));
      }
      if (!customize && preset !== null) {
        // If there's already a query parameter in the URL, append presetId using "&"
        url += feedback !== null ? `&presetId=${preset}` : `?presetId=${preset}`;
      }
      // Append the selected image to the FormData object
      formData.append('tryOnImage', selectedImageFile);
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        redirect: "follow"
      });
      const data = await response.json();
      if (response.ok) {
        setTryOnResult({
          images_url : data.result.images_url,
          prompt_id : data.result.prompt_id
      });
        setLoading(false);
        console.log('Generated result images:', data.result.images_url);
      } else {
        console.error('Failed to generate result images:', data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error generating result images:', error);
      setLoading(false);
    }
  };
  const ratingTryOn = async () => {
    try {
      // Create a new FormData object
      let url = config.serverUrl + '/try-on/rate';
      // Append the selected image to the FormData object
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'rating':rating,
          'try_on_id':tryOnResult.prompt_id
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Successful rating result');
      } 
    } catch (error) {
      console.error('Error rating results:', error);
    }
  };
  const handleRegenerateTryOnResult = async () => {
    if (feedback !== null) {
      setLoading(true);
      setTryOnResult({
        images_url : [],
        prompt_id : null
      });
      await generateTryOnResult();
      setFeedback(null);
    }
  }
  useEffect(() => {
    if (currentStep === 5 && (Object.values(optionSelected).some(value => value !== null) || preset != null)) {
      generateTryOnResult();
    }
  }, [currentStep])

  //---------------------------- user interaction handling -------------------------------//
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    if(currentStep === 4){
      setPreset(null);
      setOptionSelected({
        haircut: null,
        color: null,
        texture: null,
        attire: null,
        highlight: null,
        parting: null,
        volume: null,
        accessories: null,
        styling: null,
    });
    }
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleComplete = async () => {
    await ratingTryOn();
    setRating(0);
    navigate('/explore');
  };

  const captureImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSelectedImage(imageSrc);
    const blob = await fetch(imageSrc).then((res) => res.blob());
    const file = new File([blob], 'screenshot.png', { type: 'image/png' });
    setSelectedImageFile(file);
    setFaceDetected(await faceDetector.imageDetection(imageSrc));
  };

  const resetSelectedImage = () => {
    setSelectedImage(null);
    setSelectedImageFile(null);
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
  const handleFiles = async (files) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const file = files[0];

    // Check file type
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PNG, JPG, or JPEG image file only.');
      return;
    }

    // Check file size
    const maxSize = 1024 * 1024 * 4; // 5MB
    if (file.size > maxSize) {
      alert('File size exceeds the limit of 4MB. Please upload a smaller image.');
      return;
    }
    setSelectedImageFile(file);
    // Resize image to 512x512
    const resizeImage = (image) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 512;
      ctx.drawImage(image, 0, 0, 512, 512);
      return canvas.toDataURL('image/jpeg'); // Converted to JPEG for resizing
    };

    const reader = new FileReader();
    reader.onload = async () => {
      const img = new Image();
      img.onload = async () => {
        const resizedDataURL = resizeImage(img);

        // Set the selected image data URL to the state variable
        setSelectedImage(resizedDataURL);

        // Perform face detection
        setFaceDetected(await faceDetector.imageDetection(resizedDataURL));

        // Proceed to the next step
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
  const saveImageToDevice = (imageUrl, imageName) => {
    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', imageName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error('Error downloading image:', error));
  };
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
                        <p className='fs-4 text-secondary fw-semibold'>Drag and drop image</p>
                        <input type='file' accept='.png,.jpg,.jpeg' className='form-control d-none' ref={fileInputRef} onChange={(e) => handleFiles(e.target.files)} />
                        <button className='btn btn-lg btn-secondary'><span className='bi bi-upload me-2'></span> Choose File</button>
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
                    <div className={`border border-5 p-3 ${faceDetected ? 'border-success' : 'border-danger'}`}>
                      <h3 className={`${faceDetected ? 'text-dark' : 'text-danger'}`}>{faceDetected ? 'Preview' : 'No Face Detected In The Image'} </h3>
                      <img src={selectedImage} alt="Selected" className="selected-image" />
                      <div className="mt-4">
                        <button onClick={() => { resetSelectedImage(); handlePrevStep(); }} className='btn btn-lg btn-primary me-4'>Retake Image</button>
                        <button onClick={handleNextStep} className={`btn btn-lg ${faceDetected ? 'btn-success' : 'btn-secondary'}`} disabled={!faceDetected}>Use This Image</button>
                      </div>
                    </div>
                  )
                    : (
                      <div className={`border border-5 p-3`}>
                        <WebcamWithGuide webcamRef={webcamRef} />
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
                    <FormBox className={'responsive-tab'} onClick={() => { handleNextStep(); setCustomize(false); }}>
                      <div className='p-5'>
                        <span className='bi bi-rocket-fill px-5 icon-xl text-success '></span>
                        <p className='fs-4 text-secondary fw-semibold'>Select Recommended Hairstyle</p>
                      </div>
                    </FormBox>
                  </div>
                  <div className='col-5'>
                    <FormBox className={'responsive-tab'} onClick={() => { handleNextStep(); setCustomize(true); }}>
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
            {currentStep === 4 && !customize && (
              <div>
                <h2 className='text-start'>Preset Hairstyles</h2>
                <div className='step-content d-flex justify-content-center align-items-center mt-5'>
                  <div className='row full-width'>
                    {tryOnRecommendations.map(recommendation => (
                      <div className='col-md-3' key={recommendation.id}>
                        <FormBox className={`responsive-tab ${preset == recommendation.id?'bg-light':'bg-white'}`} onClick={() => setPreset(recommendation.id)}>
                          <div className='px-5'>
                            <img src={`${process.env.PUBLIC_URL}/sample-image/${recommendation.image_url}`} alt={recommendation.description} className='image-square-medium rounded-circle' />
                            <p className='fs-4 text-secondary fw-semibold mt-3'>{recommendation.description}</p>
                          </div>
                        </FormBox>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {currentStep === 4 && customize && (
              <div>
                <h2 className='text-start'>Custom Hairstyle Options</h2>
                <div className='step-content d-flex justify-content-center mt-4'>
                  <div className='row w-100 text-start'>
                    <div className='normalOptions'>
                      <OptionsSections
                        categoryIDs={[4]}
                        tryOnOptionCategories={tryOnOptionCategories}
                        tryOnOptions={tryOnOptions}
                        optionSelected={optionSelected.haircut}
                        setOptionSelected={setOptionSelected}
                        optionProperty={'haircut'}
                        subSection={false}
                      />
                      <OptionsSections
                        categoryIDs={[2, 3]}
                        tryOnOptionCategories={tryOnOptionCategories}
                        tryOnOptions={tryOnOptions}
                        optionSelected={optionSelected.color}
                        setOptionSelected={setOptionSelected}
                        optionProperty={'color'}
                        title={'Hair Color'}
                        subSection={true}
                        useIcon={true}
                      />
                      <OptionsSections
                        categoryIDs={[5]}
                        tryOnOptionCategories={tryOnOptionCategories}
                        tryOnOptions={tryOnOptions}
                        optionSelected={optionSelected.texture}
                        setOptionSelected={setOptionSelected}
                        optionProperty={'texture'}
                        subSection={false}
                      />
                      <OptionsSections
                        categoryIDs={[6]}
                        tryOnOptionCategories={tryOnOptionCategories}
                        tryOnOptions={tryOnOptions}
                        optionSelected={optionSelected.attire}
                        setOptionSelected={setOptionSelected}
                        optionProperty={'attire'}
                        subSection={false}
                      />
                    </div>
                    <div className='advancedOptions collapse'>
                      <h2 className='mt-5'>Advanced Customization</h2>
                      <OptionsSections
                        categoryIDs={[2, 3]}
                        tryOnOptionCategories={tryOnOptionCategories}
                        tryOnOptions={tryOnOptions}
                        optionSelected={optionSelected.highlight}
                        setOptionSelected={setOptionSelected}
                        optionProperty={'highlight'}
                        title={'Hair Highlights'}
                        subSection={true}
                        useIcon={true}
                      />
                      <OptionsSections
                        categoryIDs={[7]}
                        tryOnOptionCategories={tryOnOptionCategories}
                        tryOnOptions={tryOnOptions}
                        optionSelected={optionSelected.parting}
                        setOptionSelected={setOptionSelected}
                        optionProperty={'parting'}
                        subSection={false}
                      />
                      <OptionsSections
                        categoryIDs={[8]}
                        tryOnOptionCategories={tryOnOptionCategories}
                        tryOnOptions={tryOnOptions}
                        optionSelected={optionSelected.styling}
                        setOptionSelected={setOptionSelected}
                        optionProperty={'styling'}
                        subSection={false}
                      />
                      <OptionsSections
                        categoryIDs={[9]}
                        tryOnOptionCategories={tryOnOptionCategories}
                        tryOnOptions={tryOnOptions}
                        optionSelected={optionSelected.volume}
                        setOptionSelected={setOptionSelected}
                        optionProperty={'volume'}
                        subSection={false}
                      />
                      <OptionsSections
                        categoryIDs={[10]}
                        tryOnOptionCategories={tryOnOptionCategories}
                        tryOnOptions={tryOnOptions}
                        optionSelected={optionSelected.accessories}
                        setOptionSelected={setOptionSelected}
                        optionProperty={'accessories'}
                        subSection={false}
                      />

                    </div>
                  </div>
                </div>
                {/* Expandable button */}
                <div className="text-center mb-5 btn btn-outline-primary rounded-bottom-5 border-top-0" onClick={() => setOptionShow(!optionShow)} data-bs-toggle="collapse" href=".collapse">
                  <span className="px-5 fs-4 icon-link icon-link-hover " >
                    {optionShow ? <span className='bi bi-chevron-up'></span> : <span className='bi bi-chevron-down'></span>}
                  </span>
                </div>
              </div>

            )}
            {/* Step 5 content */}
            {currentStep === 5 && (
              <div>
                <h2 className='text-start'></h2>
                <div className='step-content d-flex justify-content-center mt-3'>
                  {!tryOnLoading ? (
                    tryOnResult.images_url.length > 0 ? (
                      <div className='row'>
                        {tryOnResult.images_url.map((image, index) => (
                          <div key={index} className='col-auto'>
                            <FormBox>
                              <img src={image.url} alt={`result-${index}`} style={{ aspectRatio: '1/1', width: '21em' }} />
                              <button
                                className='btn btn-lg btn-outline-success mt-3'
                                onClick={() => saveImageToDevice(image.url, `result-${index}.jpg`)}
                              >
                                Save Image
                              </button>
                            </FormBox>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div><p>Failed to generate image. Please try again later.</p></div>
                    )
                  ) : (
                    <div style={{ maxHeight: '60vh' }}>
                      <p className='fs-4 fw-semibold'>Please wait for image results to generate. This may take some time.</p>
                      <Loader />
                    </div>
                  )}
                </div>
              </div>
            )}
            {/*currentStep > totalSteps && creationStatus && (
              <div>
                <h2 className='text-start'>Rating for your Virtual hairstyle</h2>
                <div className='step-content d-flex justify-content-center mt-5'>
                  <RatingStars rating={rating} onRate={setRating} />
                </div>
              </div>
            )*/}
          </div>
        </div>

        {(currentStep < totalSteps && currentStep > 2) && (
          <div className={`d-flex justify-content-between`}>
            <button className="btn btn-lg btn-secondary me-3" onClick={handlePrevStep}>Prev Step</button>
            {((Object.values(optionSelected).some(value => value !== null) || preset != null) && currentStep != 3) && (
              <div>
                {currentStep !== totalSteps ? (
                  <button className="btn btn-lg btn-primary" onClick={() => handleNextStep()}>Generate</button>
                ) : (
                  <button className="btn btn-lg btn-success" onClick={() => handleComplete()}>Complete</button>
                )}
              </div>
            )}
          </div>
        )}
        {currentStep === 5 && (
          <div className={`d-flex justify-content-center`}>
            <button className="btn btn-lg btn-secondary me-3" data-bs-toggle="modal" data-bs-target="#regenerateFeedbackModal">Regenerate</button>
            <button className="btn btn-lg btn-success" data-bs-toggle="modal" data-bs-target="#ratingModal">Complete</button>
          </div>
        )}

      </div>
      <div className="modal fade left-indent" id="regenerateFeedbackModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="regenerateFeedbackModalLabel" aria-hidden="true" >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="regenerateFeedbackModalLabel">Feedback for enhancement</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="w-100 text-start px-3">
                {feedbackOptions.length > 0 && feedbackOptions.map((feedbackType) => (
                  <div className="form-check" key={feedbackType.id}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="feedback"
                      id={`feedback-${feedbackType.id}`}
                      checked={feedbackType.id === feedback}
                      onChange={() => setFeedback(feedbackType.id)}
                    />
                    <label className="form-check-label" htmlFor={`feedback-${feedbackType.id}`}>
                      {feedbackType.description}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" disabled={feedback === null} onClick={() => handleRegenerateTryOnResult()}>Send</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleComplete()}>Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade left-indent" id="ratingModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="ratingModalLabel" aria-hidden="true" >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ratingModalLabel">Rating for your virtual hairstyle</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="w-100 text-start px-3 d-flex justify-content-center">
                <RatingStars rating={rating} onRate={setRating} />
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleComplete()}>Close</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" disabled={rating == 0} onClick={() => handleComplete()}>Rate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryOnHairstyle;
