import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatDate, formatTime } from '../../utils/datetimeFormatter';
import config from '../../config';
import StatusBadge from '../../components/status-pill';
import Loader from '../../components/loading-spinner';
import RatingStars from '../../components/rating-star';

const AppointmentDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const appointmentId = state.id;
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [review, setReview] = useState({
    rating: '',
    comment: '',
    created_at: null
  });
  const [errors, setErrors] = useState({
    rating: '',
    comment: ''
  });
  const [updateEnable, setUpdateEnable] = useState(false);
  const genderMap = {
    'm': 'Male',
    'f': 'Female',
    'o': 'Other'
  };
  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
      fetchReview();
      fetchPermission();
    }
  }, [appointmentId]);
  /* api request */
  const fetchAppointmentDetails = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/appointment/get/${appointmentId}`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setAppointmentDetails(data.result);
      } else {
        console.error('Failed to fetch appointment details:', data.message);
      }
    } catch (error) {
      console.error('Error during fetch appointment details:', error);
    }
  };

  const fetchPermission = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/auth/`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        (data.role.id === 2 || data.role.id === 4) ? setUpdateEnable(true) : setUpdateEnable(false);
      } else {
        setUpdateEnable(false);
        console.error('Failed to fetch permission:', data.message);
      }
    } catch (error) {
      setUpdateEnable(false);
      console.error('Error during fetch permission:', error);
    }
  };
  const fetchReview = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/review/get/${appointmentId}`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setReview({
          comment: data.results.comment,
          rating: data.results.rating,
          created_at: data.results.created_at
        })
      } else {
        setReview({
          comment: '',
          rating: null,
          created_at: null
        })
        console.error('Failed to fetch review:', data.message);
      }
    } catch (error) {
      console.error('Error during fetch review:', error);
    }
  }
  
  const handleUpdateAppointmentReview = async () => {
      // Validate rating
    if (!review.rating) {
      setErrors(prev => ({
        ...prev,
        rating: 'Please provide a rating.'
      }));
      return;
    }else{
      setErrors(prev => ({
        ...prev,
        rating: ''
      }));
    }

    // Validate comment
    if (!review.comment.trim()) {
      setErrors(prev => ({
        ...prev,
        comment: 'Please provide a comment.'
      }));
      return;
    }else{
      setErrors(prev => ({
        ...prev,
        comment: ''
      }));
    }
    try{
      const updateReviewResponse = await fetch(`${config.serverUrl}/review/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            appointmentId : appointmentId,
            customerId : appointmentDetails.customer_id,
            serviceId : appointmentDetails.service_id,
            rating : review.rating,
            comment : review.comment
          }),
          credentials: 'include'
        });
      if (updateReviewResponse.ok) {
        toast.success('Appointment review created successfully', { autoClose: 3000 })
        fetchReview();
      } else {
        toast.warning(updateReviewResponse.json().message, { autoClose: 3000 });
      }
    } catch (error) {
      toast.warning('Failed to create review, try again later!', { autoClose: 3000 });
      console.error('Failed to create review :', error);
    }
  }
  
  const handleUpdateAppointmentStatus = async (status) => {
    try {
      const updateStatusResponse = await fetch(`${config.serverUrl}/appointment/update/${appointmentDetails.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: status
          }),
          credentials: 'include'
        });
      if (updateStatusResponse.ok) {
        toast.success('Appointment status updated successfully', { autoClose: 3000 })
        fetchAppointmentDetails();
      } else {
        toast.warning(updateStatusResponse.json().message, { autoClose: 3000 });
      }
    } catch (error) {
      toast.warning('Failed to upate appointment, try again later!', { autoClose: 3000 });
      console.error('Failed to update appointment :', error);
    }
  }
  return (
    <div>
      <div className="container px-1">
        <div className='border border-2 rounded-4 p-4 bg-white mt-4'>
          <h1 className="text-start">Appointment Details
            <span className='ms-4 fs-4 align-middle'>
              {appointmentDetails ?
                <StatusBadge status={appointmentDetails.status} />
                :
                <span className="badge rounded-pill text-bg-primary">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="sr-only"></span>
                  </div>
                </span>
              }
            </span>
          </h1>
        </div>
      </div>
      {appointmentDetails ? (
        <div className='container mt-2'>
          <div className='row'>
            {updateEnable ?
              <div className='col-md-3 bg-white rounded-4 p-4 border border-2'>
                <h4 className='border-bottom pb-1'>Customer</h4>
                <div className='text-start px-3 mt-4'>
                  <div className='row'>
                    <div className='col-12'>
                      <img src={appointmentDetails.customer_image_url ?? process.env.PUBLIC_URL + '/sample-image/person_thumbnail.png'} alt='customer-image' className='image-square-large image-cover rounded mx-auto d-block mb-3'></img>
                    </div>
                  </div>
                  <div className='row'>
                    <label className='fw-bold col-4'>Name :</label>
                    <p className='col-8' >{(appointmentDetails.customer_first_name && appointmentDetails.customer_last_name) ? appointmentDetails.customer_first_name + " " + appointmentDetails.customer_last_name : appointmentDetails.customer_username}</p>
                  </div>
                  <div className='row'>
                    <label className='fw-bold col-4'>Email :</label>
                    <p className='col-8' >{appointmentDetails.customer_email ?? 'null'}</p>
                  </div>
                  <div className='row'>
                    <label className='fw-bold col-4'>Gender :</label>
                    <p className='col-8' >{genderMap[appointmentDetails.customer_gender] || 'null'}</p>
                  </div>
                </div>
              </div>
              :
              <div className='col-md-3 bg-white rounded-4 p-4 border border-2'>
                <h4 className='border-bottom pb-1'>Salon</h4>
                <div className='text-start mt-4'>
                  <div className='row'>
                    <div className='col-12'>
                      <img src={appointmentDetails.salon_image ?? process.env.PUBLIC_URL + '/sample-image/default_salon.jpg'} alt='salon-image' className='image-square-large image-cover rounded mx-auto d-block mb-3'></img>
                    </div>
                  </div>
                  <div className='row'>
                    <label className='fw-bold col-4'>Name :</label>
                    <p className='col-8' >{appointmentDetails.name}</p>
                  </div>
                  <div className='row'>
                    <label className='fw-bold col-4'>Location :</label>
                    <p className='col-8' >{appointmentDetails.address ? appointmentDetails.address : 'null'}</p>
                  </div>
                </div>
              </div>
            }
            <div className='col-md-6 px-2'>
              <div className='bg-white rounded-4 p-4 border border-2'>
                <h4 className='border-bottom pb-1'>Appointment</h4>
                <div className='text-start px-3 mt-4'>
                  <div className='row'>
                    <label htmlFor='date' className='fw-bold col-4'>Date :</label>
                    <p className='col-8' id='date'>{formatDate(appointmentDetails.booking_datetime)}</p>
                  </div>
                  <div className='row'>
                    <label htmlFor='time' className='fw-bold col-4'>Time :</label>
                    <p className='col-8' id='time'>{formatTime(appointmentDetails.booking_datetime)}</p>
                  </div>
                  <div className='row'>
                    <label htmlFor='remarks' className='fw-bold col-4'>Remarks :</label>
                    <p className='col-8' id='remarks'>{appointmentDetails.remarks ?? "No remarks"}</p>
                  </div>
                </div>
              </div>
              <div className='bg-white rounded-4 p-4 border border-2 mt-2'>
                <h4 className='border-bottom pb-1'>Service</h4>
                <div className='text-start px-3 mt-4'>
                  <div className='row'>
                    <label className='fw-bold col-4'>Service Name :</label>
                    <p className='col-8' >{appointmentDetails.service_name}</p>
                  </div>
                  <div className='row'>
                    <label className='fw-bold col-4'>Service Description :</label>
                    <p className='col-8' >{appointmentDetails.desc}</p>
                  </div>
                  <div className='row'>
                    <label className='fw-bold col-4'>Service Duration :</label>
                    <p className='col-8' > {appointmentDetails.duration} minutes</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-3 bg-white rounded-4 p-4 border border-2'>
              <h4 className='border-bottom pb-1'>Hairstylist</h4>
              <div className='text-start mt-4'>
                <div className='row'>
                  <div className='col-12'>
                    <img src={appointmentDetails.hairstylist_image ? appointmentDetails.hairstylist_image : process.env.PUBLIC_URL + '/sample-image/person_thumbnail.png'} alt='hairstylist-image' className='image-square-large image-cover rounded mx-auto d-block mb-3'></img>
                  </div>
                </div>
                <div className='row'>
                  <label className='fw-bold col-4'>Name :</label>
                  <p className='col-8' >{appointmentDetails.hairstylist_name}</p>
                </div>
                <div className='row'>
                  <label className='fw-bold col-4'>Position :</label>
                  <p className='col-8' >{appointmentDetails.hairstylist_position ? appointmentDetails.hairstylist_position : 'null'}</p>
                </div>
              </div>
            </div>
            {appointmentDetails.status === 'COMPLETED' && (review.created_at || !updateEnable) && (
              <div className='col-md-12 bg-white rounded-4 p-4 pb-3 border border-2 mt-2'>
                <h4 className='border-bottom pb-1'>Review</h4>
                <div className='text-start mt-3'>
                  {review.created_at ? (
                    <div>
                      <RatingStars rating={review.rating} onRate={() => {}}  className={'fs-3'} responsive={false}/>
                      <div className='row mt-3 ps-2'>
                        <label className='fw-bold col-1'>Comment :</label>
                        <p className='col-10 ' >{review.comment??""}</p>
                      </div>
                    </div>
                  ) : !updateEnable && (
                    <div>
                      <RatingStars rating={review.rating} onRate={(newRating) => setReview(prev => ({
                        ...prev,
                        rating: newRating
                      }))} className={'fs-3'} />
                      {errors.rating && <p className="text-danger">{errors.rating}</p>}
                      <div className="form-floating m-2">
                        <textarea
                          className="form-control"
                          placeholder="Leave a comment here"
                          id="floatingTextarea"
                          style={{ minHeight: '85px',maxHeight: '200px' }}
                          onChange={(event) => setReview(prev => ({
                            ...prev,
                            comment: event.target.value
                          }))}
                          value={review.comment || ''}
                        ></textarea>
                        <label htmlFor="floatingTextarea">Comments</label>
                        {errors.comment && <p className="text-danger">{errors.comment}</p>}
                      </div>
                      <div className='text-center'>
                        <button className='btn btn-lg btn-primary' onClick={()=>handleUpdateAppointmentReview()}>Submit Review</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {appointmentDetails.status !== 'COMPLETED' && appointmentDetails.status !== 'CANCELLED' && (<div className='mt-3 border-top pt-3 d-flex justify-content-center'>
            {(updateEnable && appointmentDetails.status === 'PENDING') ? (
              <div>
                <button className='btn btn-success me-3' onClick={() => handleUpdateAppointmentStatus('CONFIRMED')}>Accept Appointment</button>
                <button className='btn btn-danger' data-bs-target="#cancelAppointmentConfirmationModal" data-bs-toggle="modal">Cancel Appointment</button>
              </div>
            ) : updateEnable && (
              <div>
                <button className='btn btn-primary' onClick={()=>navigate('/appointment/reschedule', { state: { appointmentDetails } })}>Reschedule Appointment Time</button>
              </div>
            )}
          </div>)}
            {!updateEnable && appointmentDetails.status === 'PENDING' && (
            <div>
              <button className='btn btn-danger' data-bs-target="#cancelAppointmentConfirmationModal" data-bs-toggle="modal">Cancel Appointment</button>
            </div>
            ) 
            }
        </div>

      ) : (
        <div style={{ maxHeight: '60vh' }}>
          <p className='fs-4 fw-semibold'>Loading Appointemnt Details. </p>
          <Loader />
        </div>
      )
      }

      <ToastContainer
        position='top-center'
      />
      <div className="modal fade" id="cancelAppointmentConfirmationModal" aria-hidden="true" aria-labelledby="cancelAppointmentConfirmationModalLabel" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="cancelAppointmentConfirmationModalLabel">Confirmation of Cancellation</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Confirm to Cancel this Appointment?<br></br> This action is not able to undo.
            </div>
            <div className="modal-footer ">
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => handleUpdateAppointmentStatus('CANCELLED')}>Confirm</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AppointmentDetail;
