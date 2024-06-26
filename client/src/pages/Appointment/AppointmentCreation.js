import React, { useState, useEffect } from 'react';
import config from '../../config';
import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import AsyncSelect from 'react-select/async';
import { formatDate, formatTime, formatDateInverse, convertTo12HourFormat } from '../../utils/datetimeFormatter';

const AppointmentCreation = () => {
  //---------------------------- state variable -------------------------------//
  let { state } = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [selectedService, setSelectedService] = useState(
    {
      value: state?.service?.id,
      label: state?.service?.service_name
    });
  const [selectedHairstylist, setSelectedHairstylist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  //format to .toISOString().split('T')[0] before concat with time
  const [selectedTime, setSelectedTime] = useState(null);
  const [remarks, setRemarks] = useState(null);

  //static options
  const [options, setOptions] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [timeSlotsError, setTimeSlotError] = useState(null);

  // Validation state variables
  const [serviceError, setServiceError] = useState(false);
  const [hairstylistError, setHairstylistError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [timeError, setTimeError] = useState(false);


  const salonId = state?.salonInformation.id;
  const salonName = state?.salonInformation.name;

  //Appointment creation status
  const [creationStatus, setCreationStatus] = useState(null);
  //---------------------------- remote option api request -------------------------------//
  //load only available services
  const loadServices = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/service/all/${salonId}?status=1`, { credentials: 'include' });
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
  useEffect(() => {
    const loadHairstylists = async () => {
      try {
        const response = await fetch(`${config.serverUrl}/service/get/${selectedService.value}`, { credentials: 'include' });
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
    if (selectedService) {
      console.log(selectedService);
      loadHairstylists();
    }
  }, [selectedService]);

  useEffect(() => {
    //console.log(selectedDate);
    const loadAvailableTimeSlots = async () => {
      try {
        const response = await fetch(`${config.serverUrl}/appointment/timeslots?serviceId=${selectedService.value}&appointmentDate=${formatDateInverse(selectedDate)}`, { credentials: 'include' });
        const data = await response.json();
        if (!response.ok) {
          console.log('Failed to fetch data :', data.message);
          setTimeSlotError(data.message);
        } else {
          setTimeSlotError(null);
          setAvailableTimeSlots(data);
        }
      } catch (error) {
        console.error('Error fetching time slots :', error);
      }
    }

    if (currentStep === 3) {
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
        console.log(selectedDate);
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

  const handleComplete = async () => {

    try {
      const response = await fetch(`${config.serverUrl}/appointment/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serviceId: selectedService.value,
            hairstylistId: selectedHairstylist.value,
            bookingDateTime: formatDateInverse(selectedDate) + ' ' + (selectedTime),
            remarks: remarks
          }),
          credentials: 'include'
        });
      if (response.ok) {
        setCreationStatus(true);
        console.log("Appointment Creation Successfully.");
      } else {
        setCreationStatus(false);
        console.error("Appointment Creation Failed.", response.json().message);
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Failed to create appointment :', error);
    }

  };

  //handle change input for not null
  const handleSelectChange = (selectedOption, setSelected, setDefault, setError) => {
    setSelected(selectedOption);
    console.log("State changed");
    if (setDefault !== null)
      setDefault(null);
    setError(false);
  };

  //---------------------------- helper and formatting method -------------------------------//

  //---------------------------- html -------------------------------//
  return (
    <div className="container-fluid my-3 full-width">
      <div className='border border-2 rounded-4 p-4 ps-5 bg-white min-height mb-4'>
        <div className="progress mb-4">
          <div className={`progress-bar ${currentStep === 5 ? 'bg-success' : ''}`} role="progressbar" style={{ width: `${(currentStep - 1) / totalSteps * 100}%` }} aria-valuenow={(currentStep - 1) / totalSteps * 100} aria-valuemin="0" aria-valuemax="100"></div>
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
                          handleSelectChange(selectedOption, setSelectedService, setSelectedHairstylist, setServiceError)
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
                          handleSelectChange(selectedOption, setSelectedHairstylist, null, setHairstylistError)
                        }
                        placeholder={selectedService ? "Select a hairstylist" : "Select service first"}
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
                      handleSelectChange(selectedOption, setSelectedDate, null, setDateError)
                    }
                    value={selectedDate}
                    defaultValue={new Date()}
                    minDate={new Date()}
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
                  {timeSlotsError || (availableTimeSlots.length <= 0) ? (
                    <div className='fs-4'>
                      <p>No timeslot available on selected day due to</p>
                      <p className='fw-semibold'>{timeSlotsError ?? 'Salon Fully Booked'}</p>
                    </div>
                  ) : (
                    <div className="row row-cols-3">
                      {availableTimeSlots.map((slot, index) => (
                        <div key={index} className="col mb-5">
                          <button
                            className={`btn btn-outline-primary btn-lg ${selectedTime === new Date(slot.start).toLocaleTimeString('it-IT') ? 'active' : ''}`}
                            onClick={() => handleSelectChange(new Date(slot.start).toLocaleTimeString('it-IT'), setSelectedTime, null, setTimeError)}>
                            {new Date(slot.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - {new Date(slot.end).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {timeError && <div className="text-danger text-center fs-5">* Please select a time slots.</div>}
              </div>
            )}
            {/* Step 4 content */}
            {currentStep === 4 && (
              <div>
                <h2 className='text-start'>Confirm Selection</h2>
                <div className='step-content d-flex justify-content-center mt-5'>
                  <div className='text-start mt-4 px-4 fs-5 full-width'>
                  <div className='row'>
                    <div className='col-6'>
                      <div className='row'>
                        <div className='col-4'>
                          <label htmlFor='date' className='fw-bold col-form-label'>Salon :</label>
                        </div>
                        <div className='col-8'>
                          <p className='form-control' id='salon'>{salonName}</p>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-4'>
                          <label htmlFor='time' className='fw-bold col-form-label'>Service :</label>
                        </div>
                        <div className='col-8'>
                          <p className='form-control' id='service'>{selectedService.label}</p>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-4'>
                          <label htmlFor='time' className='fw-bold col-form-label'>Hairstylist :</label>
                        </div>
                        <div className='col-8'>
                        <p className='form-control' id='hairstylist'>{selectedHairstylist.label}</p>
                        </div>
                      </div>
                    </div>
                    <div className='col-6'>
                      <div className='row'>
                        <div className='col-4'>
                          <label htmlFor='date' className='fw-bold col-form-label'>Date :</label>
                        </div>
                        <div className='col-8'>
                          <p className='form-control' id='date'>{formatDate(selectedDate)}</p>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-4'>
                          <label htmlFor='time' className='fw-bold col-form-label'>Time :</label>
                        </div>
                        <div className='col-8'>
                          <p className='form-control' id='time'>{convertTo12HourFormat(selectedTime)}</p>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-4'>
                          <label htmlFor='time' className='fw-bold col-form-label'>Remark :</label>
                        </div>
                        <div className='col-8'>
                          <textarea className='form-control' type="text" placeholder="Optional remarks for salon" value={remarks ?? ''} onChange={(e) => setRemarks(e.target.value)} style={{ resize: 'none', minHeight: '120px' }} autoFocus></textarea>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Step 4 content */}
            {currentStep > totalSteps && creationStatus === null && (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            {currentStep > totalSteps && creationStatus === true && (
              <div>
                <h2 className='text-start'>Appointment Completed</h2>
                <div className='step-content mt-5 d-flex justify-content-center'>
                  <div className='row justify-content-center'>
                    <i className='bi bi-check2-circle text-success' style={{ fontSize: '6rem' }}></i>
                    <h3>Scheduled your Appointment</h3> {/* Heading */}
                    <p className='col-3 mt-4'>Your appointment is submitted, the service provider will review your appointment within 24 - 48 hours, kindly check your appointment status to confirm your appointment.</p> {/* Paragraph */}
                    <div className='col-12 my-4'>
                      <button className="btn btn-lg btn-success" onClick={() => navigate('/')}>Return to Home</button> {/* Button */}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentStep > totalSteps && creationStatus === false && (
              <div>
                <h2 className='text-start'>Appointment Failed</h2>
                <div className='step-content mt-5 d-flex justify-content-center'>
                  <div className='row justify-content-center'>
                    <i className='bi bi-calendar-x text-danger' style={{ fontSize: '6rem' }}></i>
                    <h3>Failed to Scheduled your Appointment</h3> {/* Heading */}
                    <p className='col-3 mt-4'>Your appointment is not submitted, please try again later. Thank you.</p> {/* Paragraph */}
                    <div className='col-12 my-4'>
                      <button className="btn btn-lg btn-success" onClick={() => navigate('/')}>Return to Home</button> {/* Button */}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {currentStep <= totalSteps && (
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
      </div>
    </div >
  );
};

export default AppointmentCreation;
