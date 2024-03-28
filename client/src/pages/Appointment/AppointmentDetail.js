import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatDate, formatTime } from '../../utils/datetimeFormatter';
import config from '../../config';
import StatusBadge from '../../components/status-pill';

const AppointmentDetail = () => {
  const { state } = useLocation();
  const appointmentId = state.id;
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [updateEnable, setUpdateEnable] = useState(false);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
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
        (data.role.name === 'Web Administrator' || data.role === 'Salon Owner') ? setUpdateEnable(true) : setUpdateEnable(false);
      } else {
        setUpdateEnable(false);
        console.error('Failed to fetch permission:', data.message);
      }
    } catch (error) {
      setUpdateEnable(false);
      console.error('Error during fetch permission:', error);
    }
  };

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
    <div className="container border border-2 rounded-4 p-4 bg-white mt-4">
      <h1 className="text-start mb-4">Appointment Details</h1>
      {appointmentDetails ? (
        <div>
          <div className='text-start'>
            <h4 className='border-bottom'>Service Information</h4>
            <p><strong>Service Name:</strong> {appointmentDetails.service_name}</p>
            <p><strong>Service Description:</strong> {appointmentDetails.desc}</p>
            <p><strong>Service Duration:</strong> {appointmentDetails.duration} minutes</p>

            <h4 className='border-bottom'>Appointment Information</h4>
            <p><strong>Date:</strong> {formatDate(appointmentDetails.booking_datetime)}</p>
            <p><strong>Time:</strong> {formatTime(appointmentDetails.booking_datetime)}</p>
            <p><strong>Remarks:</strong> {appointmentDetails.remarks}</p>

            <h4 className='border-bottom'>Salon Information</h4>
            <p><strong>Salon Name:</strong> {appointmentDetails.name}</p>
            <p><strong>Salon Location:</strong> {appointmentDetails.address}</p>

            <h4 className='border-bottom'>Status</h4>
            <p className='pt-1'><StatusBadge status={appointmentDetails.status} /></p>

          </div>
          {appointmentDetails.status !== 'COMPLETED' && appointmentDetails.status !== 'CANCELLED' && appointmentDetails.status !== 'IN PROGRESS' && (<div className='mt-3 border-top pt-3 d-flex justify-content-end'>
            {(updateEnable && appointmentDetails.status === 'PENDING') ? (
              <div>
                <button className='btn btn-success me-3' onClick={() => handleUpdateAppointmentStatus('CONFIRMED')}>Accept Appointment</button>
                <button className='btn btn-danger' data-bs-target="#cancelAppointmentConfirmationModal" data-bs-toggle="modal">Cancel Appointment</button>
              </div>
            ) : (
              <div>
                <button className='btn btn-primary'>Reschedule Appointment Time</button>
              </div>
            )}
          </div>)}
        </div>
      ) : (
        <p>Loading appointment details...</p>
      )
      }

      <ToastContainer
        position='top-center'
      />
      <div class="modal fade" id="cancelAppointmentConfirmationModal" aria-hidden="true" aria-labelledby="cancelAppointmentConfirmationModalLabel" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="cancelAppointmentConfirmationModalLabel">Confirmation of Cancellation</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              Confirm to Cancel this Appointment?<br></br> This action is not able to undo.
            </div>
            <div class="modal-footer ">
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onClick={()=> handleUpdateAppointmentStatus('CANCELLED')}>Confirm</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetail;
