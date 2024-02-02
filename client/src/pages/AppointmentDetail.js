import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { formatDate,formatTime } from '../utils/datetimeFormatter';
import config from '../config';
import StatusBadge from '../components/status-pill';

const AppointmentDetail = () => {
  const { state } = useLocation();
  const appointmentId = state && state.id;

  const [appointmentDetails, setAppointmentDetails] = useState(null);

  useEffect(() => {
    // Fetch appointment details from the API based on appointmentId
    const fetchAppointmentDetails = async () => {
      try {
        const response = await fetch(`${config.serverUrl}/appointment/get/${appointmentId}`,{
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

    if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [appointmentId]);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Appointment Details</h1>
      {appointmentDetails ? (
        <div>
          <h4>Service Information</h4>
          <p><strong>Service Name:</strong> {appointmentDetails.service_name}</p>
          <p><strong>Service Description:</strong> {appointmentDetails.desc}</p>
          <p><strong>Service Duration:</strong> {appointmentDetails.duration} minutes</p>

          <h4>Appointment Information</h4>
          <p><strong>Date:</strong> {formatDate(appointmentDetails.booking_datetime)}</p>
          <p><strong>Time:</strong> {formatTime(appointmentDetails.booking_datetime)}</p>
          <p><strong>Remarks:</strong> {appointmentDetails.remarks}</p>

          <h4>Salon Information</h4>
          <p><strong>Salon Name:</strong> {appointmentDetails.salon_name}</p>
          <p><strong>Salon Location:</strong> {appointmentDetails.salon_location}</p>

          <h4>Status</h4>
          <p><strong>Status:   </strong><StatusBadge status={appointmentDetails.status}/></p>
        </div>
      ) : (
        <p>Loading appointment details...</p>
      )}
    </div>
  );
};

export default AppointmentDetail;
