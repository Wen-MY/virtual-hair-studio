import React, { useState,useEffect } from 'react';
import config from '../config';
import { redirect, useLocation } from 'react-router-dom';
import Select from 'react-select';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css'
import AsyncSelect from 'react-select/async';

const AppointmentCreation = () => {
  //---------------------------- state variable -------------------------------//
  let { state } = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [selectedService, setSelectedService] = useState(state?.service || null);
  const [selectedHairstylist, setSelectedHairstylist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  //format to .toISOString().split('T')[0] before concat with time
  const [selectedTime, setSelectedTime] = useState(null);

  //static options
  const [options, setOptions] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Validation state variables
  const [serviceError, setServiceError] = useState(false);
  const [hairstylistError, setHairstylistError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  

  const salonId = state?.salonInformation.id;
  const salonName = state?.salonInformation.name;
  

  //---------------------------- remote option api request -------------------------------//
  //load only available services
  const loadServices = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/service/all/${salonId}?status=1`);
      const data = await response.json();
      const options = data.result.map((service) => ({
        value: service.id,
        label: service.service_name,
      }));
      return options;
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  };
  
  useEffect(()=> {

  const loadHairstylists = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/service/get/${selectedService.value}`);
      const data = await response.json();
      setOptions(data.hairstylists.map(hairstylist => ({
        value: hairstylist.id,
        label: hairstylist.name
      })));
    } catch (error) {
      console.error('Error fetching hairstylists:', error);
      return [];
    }
  };
  if(selectedService)
    loadHairstylists();
},[selectedService]);

useEffect(() => {
  const loadAvailableTimeSlots = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/appointment/timeslots?serviceId=${selectedService.value}&appointmentDate=${selectedDate.toISOString().split('T')[0]}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setAvailableTimeSlots(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching time slots :', error);
    }
  }

  if (currentStep == 3) {
    loadAvailableTimeSlots();
  }
}, [currentStep]);

//---------------------------- user interaction handling -------------------------------//
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case 1:
        setServiceError(selectedService === null);
        setHairstylistError(selectedHairstylist === null);
        if (selectedService !== null && selectedHairstylist !== null) setCurrentStep(currentStep + 1);
        break;
      case 2:
        setDateError(selectedDate === null);
        if (selectedDate !== null) setCurrentStep(currentStep + 1);
        break;
      case 3:
        setTimeError(selectedTime === null);
        if (selectedTime !== null) setCurrentStep(currentStep + 1);
        break;
      default:
        setCurrentStep(currentStep + 1);
    }
  };
  
  const handleComplete = () => {
    // Handle complete action
    setCurrentStep(currentStep + 1);
  };

  //handle change input for not null
  const handleSelectChange = (selectedOption, setSelected, setDefault, setError) => {
    setSelected(selectedOption);
    if(setDefault !== null)
      setDefault(null);
    setError(false);
  };
  //---------------------------- helper and formatting method -------------------------------//
  
  //---------------------------- html -------------------------------//
  return (
    <div className="container-fluid my-3 full-width">
      <div className='border border-2 rounded-4 p-4 ps-5 bg-white min-height mb-4'>
        <div className="progress mb-4">
          <div className={`progress-bar ${currentStep == 5 ? 'bg-success' : ''}`} role="progressbar" style={{ width: `${(currentStep-1) / totalSteps * 100}%` }} aria-valuenow={(currentStep - 1) / totalSteps * 100} aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        {/* Step content */}
        <div className="mb-3">
          <div className='border border-2 rounded-4 p-4 ps-5 bg-white min-height mb-4'>
            {/* Step 1 content */}
            {currentStep === 1 && (
              <div>
                <h2 className='step-title text-start'>Select Service</h2>
                <div className='step-content d-flex justify-content-center mt-5 row'>
                  {/* Input fields for step 1 */}
                  <div className="mb-3 row">
                    <label htmlFor="salonName" className="form-label col-sm-2 col-form-label fw-semibold">Salon :</label>
                    <div className='col-sm-3'>
                      <input
                        type="text"
                        className="form-control-plaintext"
                        name="salonName"
                        id="salonName"
                        readOnly
                        disabled
                        value={salonName}
                      />
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <label htmlFor="serviceSeletion" className="form-label col-sm-2 col-form-label fw-semibold">Service :</label>
                    <div className='col-sm-4'>
                      <AsyncSelect
                        cacheOptions
                        loadOptions={loadServices}
                        defaultOptions
                        value={selectedService}
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, setSelectedService,setSelectedHairstylist, setServiceError)
                        }
                        placeholder="Select a service"
                        id='serviceSeletion'
                        required
                      />
                      {serviceError && <div className="text-danger text-start">* Please select a service.</div>}
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <label htmlFor="hairstylistSelection" className="form-label col-sm-2 col-form-label fw-semibold">Hairstylist :</label>
                    <div className='col-sm-4'>
                      <Select
                        options={options}
                        value={selectedHairstylist}
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, setSelectedHairstylist,null, setHairstylistError)
                        }
                        placeholder={selectedService?"Select a hairstylist":"Select service first"}
                        isDisabled={!selectedService}
                        id='hairstylistSelection'
                        required
                      />
                      {hairstylistError && <div className="text-danger text-start">Please select a hairstylist.</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Step 2 content */}
            {currentStep === 2 && (
              <div>
                <h2 className='text-start'>Select Appointment Date</h2>
                <div className='step-content d-flex justify-content-center mt-5'>
                  {/* Input fields for step 2 */}
                  <Calendar
                    onChange={(selectedOption) =>
                      handleSelectChange(selectedOption, setSelectedDate,null, setDateError)
                    }
                    value={selectedDate}
                    defaultValue={new Date()}
                    minDate = {new Date()}
                  />
                </div>
                <div className="mt-5 row date-preview text-center d-flex justify-content-center">
                  <label htmlFor="selectedDate" className="form-label col-auto col-form-label fw-semibold">Appointment Date :</label>
                  <div className='col-auto'>
                    <input
                      type="text"
                      className="form-control"
                      name="selectedDate"
                      id="selectedDate"
                      readOnly
                      disabled
                      value={selectedDate.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                    />
                  </div>
                  {dateError && <div className="text-danger text-start">Please select a valid date.</div>}
                </div>
              </div>
            )}
            {/* Step 3 content */}
            {currentStep === 3 && (
              <div>
                <h2 className='text-start'>Choose Available Time Slot</h2>
                <div className='step-content mt-5 d-flex justify-content-center'>
                  <div className="row row-cols-3">
                    {availableTimeSlots.map((slot, index) => (
                      <div key={index} className="col mb-5">
                        <button
                          className={`btn btn-outline-primary btn-lg ${selectedTime === new Date(slot.start).toTimeString() ? 'active' : ''}`}
                          onClick={() => handleSelectChange(new Date(slot.start).toTimeString(), setSelectedTime,null, setTimeError)}>
                          {new Date(slot.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - {new Date(slot.end).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {timeError && <div className="text-danger text-center fs-5">* Please select a time slots.</div>}
              </div>
            )}
            {/* Step 4 content */}
            {currentStep === 4 && (
              <div>
                <h2 className='text-start'>Expected Hairstyle Try-On (if any)</h2>
                <div className='step-content d-flex justify-content-center mt-5'>
                  {/* Input fields for step 4 */}
                  <input type="text" placeholder="Input for Step 4" />
                </div>
              </div>
            )}
            {/* Step 4 content */}
            {currentStep > totalSteps && (
              <div>
                <h2 className='text-center'>Return to home</h2>
                <div className='step-content d-flex justify-content-center mt-5'>
                  <button className="btn btn-lg btn-secondary me-3" onClick={redirect('./appointments')}>Prev Step</button>
                </div>
              </div>
            )}
          </div>
        </div>
        {currentStep <= totalSteps && (
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

export default AppointmentCreation;
