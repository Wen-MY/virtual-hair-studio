import React, { useState,useEffect } from 'react';
import config from '../config';
import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'react-time-picker/dist/TimePicker.css'
import AsyncSelect from 'react-select/async';

const TryOnHairstyle = () => {
  //---------------------------- state variable -------------------------------//
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [creationStatus,setCreationStatus] = useState(true); //temp
  const totalSteps = 5;

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

  //handle change input for not null


  //---------------------------- helper and formatting method -------------------------------//
  
  //---------------------------- html -------------------------------//
  return (
    <div className="container-fluid my-3 full-width">
      <div className='border border-2 rounded-4 p-4 ps-5 bg-white min-height mb-4'>
        <div className="progress mb-4">
          <div className={`progress-bar ${currentStep === totalSteps+1 ? 'bg-success' : ''}`} role="progressbar" style={{ width: `${(currentStep-1) / totalSteps * 100}%` }} aria-valuenow={(currentStep - 1) / totalSteps * 100} aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        {/* Step content */}
        <div className="mb-3">
          <div className='border border-2 rounded-4 p-4 ps-5 bg-white min-height mb-4'>
            {/* Step 1 content */}
            {currentStep === 1 && (
              <div>
                <h2 className='step-title text-start'>Term of Use</h2>
                <div className='step-content d-flex justify-content-center mt-5 row'>
                  {/* Input fields for step 1 */}
                  <div className="mb-3 row">
                  </div>
                </div>
              </div>
            )}
            {/* Step 2 content */}
            {currentStep === 2 && (
              <div>
                <h2 className='text-start'>Take a Valid Selfie Or Select an Valid Image</h2>
                <div className='step-content d-flex justify-content-center mt-5'>
                </div>
              </div>
            )}
            {/* Step 3 content */}
            {currentStep === 3 && (
              <div>
                <h2 className='text-start'>Choose Desired Hairstyle Variation</h2>
                <div className='step-content mt-5 d-flex justify-content-center'>
                </div>
              </div>
            )}
            {/* Step 4 content */}
            {currentStep === 4 && (
              <div>
                <h2 className='text-start'>Choose Hairstyle Options</h2>
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
            {currentStep > totalSteps && creationStatus &&(
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
        {currentStep <= totalSteps &&(
          <div className={`d-flex justify-content-${currentStep === 1?'end':'between' }`}>
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
      </div>
    </div>
  );
};

export default TryOnHairstyle;
