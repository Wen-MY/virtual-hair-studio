import React, { useEffect, useState, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment';
import config from '../../config';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import Loader from '../../components/loading-spinner';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import '../../styles/customBigCalendar.css'
import 'react-toastify/dist/ReactToastify.css';
const localizer = momentLocalizer(moment);

const AppointmentReschedule = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState(null);// Initially set to month view
  const [currentDate, setCurrentDate] = useState(null);
  const [rescheduling, setRescheduling] = useState(false);
  const DnDCalendar = withDragAndDrop(Calendar)
  const [rescheduledAppointment, setRescheduledAppointment] = useState([]);
  const [temp, setTemp] = useState([]);
  const fetchData = async (startDate, endDate) => {
    try {
      const response = await fetch(`${config.serverUrl}/appointment/retrieve?status=CONFIRMED&range=${startDate}_${endDate}`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.results) {
        const mappedEvents = data.results.map(appointment => ({
          title: appointment.service_name,
          start: new Date(appointment.booking_datetime),
          end: moment(new Date(appointment.booking_datetime)).add(appointment.duration, 'minutes').toDate(),
          status: appointment.status,
          id: appointment.id
        }));
        setEvents(mappedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleRangeChange = useCallback(async (range, view) => {
    let crView = view ? (view) : currentView;
    if (view) setCurrentView(view);

    //console.log(crView);
    //console.log(range);

    const today = new Date();
    let start, end;
    if (crView === 'week') {
      setCurrentDate(getMostlyInRangeMonth(range[0], range[range.length - 1]));
      start = moment(range[0]).startOf('week').toDate().toLocaleString();
      end = moment(range[range.length - 1]).endOf('week').toDate().toLocaleString();
    } else if (crView === 'month') {
      setCurrentDate(getMostlyInRangeMonth(range.start, range.end));
      start = moment(range.start).startOf('day').toDate().toLocaleString();
      end = moment(range.end).endOf('day').toDate().toLocaleString();
    } else if (crView === 'agenda') {
      start = moment(today).toDate();
      end = moment(today).add(1, 'day').endOf('day').toDate().toLocaleString();
    }
    await fetchData(start, end);

  }, [currentView]);
  const handleRescheduling = (status) => {
    if (status) {
      setTemp(events);
    }
    setRescheduling(status);
  }
  const returnOriginalEvent = () => {
    setEvents(temp);
  }
  const handleEventDrop = useCallback(({ event, start, end }) => {
    try {
      // Update event in the client-side state directly
      setEvents(prevEvents => prevEvents.map(prevEvent =>
        prevEvent.id === event.id ? { ...prevEvent, start, end } : prevEvent
      ));
      const updatedEvent = { ...event, start, end };
      setRescheduledAppointment(prevRescheduledAppointments => [...prevRescheduledAppointments, updatedEvent]);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  }, [setEvents, setRescheduledAppointment]);

  const handleSaveRescheduledEvent = async () => {
    try {
      // Call API to update each rescheduled event
      await Promise.all(rescheduledAppointment.map(async event => {
        const response = await fetch(`${config.serverUrl}/appointment/update/${event.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            bookingDateTime: moment(event.start).format('YYYY-MM-DD HH:mm:ss'),
          }),
          credentials: 'include'
        });
        // Handle response
        const updateData = await response.json();
        if (response.ok) {
          // Update successful, remove the event from rescheduledAppointment
          setRescheduledAppointment(prevRescheduledAppointments =>
            prevRescheduledAppointments.filter(e => e.id !== event.id)
          );
          toast.success(updateData.message, { autoClose: 3000 });
          navigate('/appointment/reschedule');
        } else {
          console.error('Failed to update event:', response.statusText);
          toast.warning(updateData.message, { autoClose: 3000 });
        }
      }));

      // Refresh appointments by fetching updated data based on current view and range
      const today = new Date();
      let start, end;
      if (currentView === 'week') {
        start = moment(events[0]?.start).startOf('week').toDate().toLocaleString();
        end = moment(events[events.length - 1]?.end).endOf('week').toDate().toLocaleString();
      } else if (currentView === 'month') {
        start = moment(events[0]?.start).startOf('month').toDate().toLocaleString();
        end = moment(events[events.length - 1]?.end).endOf('month').toDate().toLocaleString();
      } else if (currentView === 'agenda') {
        start = moment(today).toDate();
        end = moment(today).add(1, 'month').endOf('month').toDate().toLocaleString();
      }
      await fetchData(start, end);
      setRescheduling(!rescheduling);
    } catch (error) {
      console.error('Error saving rescheduled events:', error);
    }
  }
  //initial fetch
  useEffect(() => {
    if (state?.appointmentDetails) {
      console.log(state);
      const today = new Date(state.appointmentDetails.booking_datetime);
      setCurrentDate(today);
      setCurrentView('week');
      fetchData(moment(today).startOf('week').toDate().toLocaleString(), moment(today).endOf('week').toDate().toLocaleString()); // Fetch data for the current day initially

    } else {
      const today = new Date();
      setCurrentView('month');
      setCurrentDate(today);
      fetchData(moment(today).startOf('month').toDate().toLocaleString(), moment(today).endOf('month').toDate().toLocaleString()); // Fetch data for the current day initially
    }

  }, []);

  //console.log(events);
  const getMostlyInRangeMonth = (startDate, endDate) => {
    // Convert startDate and endDate to Date objects if they are strings
    if (typeof startDate === 'string') {
      startDate = new Date(startDate);
    }
    if (typeof endDate === 'string') {
      endDate = new Date(endDate);
    }

    // Calculate the middle date between startDate and endDate
    const middleDate = new Date((startDate.getTime() + endDate.getTime()) / 2);


    // Return the month index (0 for January, 1 for February, ..., 11 for December)
    return middleDate;
  };

  const scrollToAppointment = (appointment_id) => {
    const appointmentElement = document.querySelector(`.event-${appointment_id}`);
    if (appointmentElement) {
        appointmentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        appointmentElement.classList.add('outlined-pop'); // Apply the CSS class

    // Wait for 2 seconds and then remove the CSS class
    setTimeout(() => {
      appointmentElement.classList.remove('outlined-pop');
      document.querySelector('#rescheduleBtn').scrollIntoView({ behavior: 'smooth', block: 'center' });
      document.querySelector('#rescheduleBtn').classList.add('outlined-pop');
    }, 1000);
    }
  }
  useEffect(() => {
    
    if (state?.appointmentDetails && !rescheduling) {
      if (currentView) {
        scrollToAppointment(state.appointmentDetails.id);
      }
    }
  }, [events]);

  const eventPropGetter = useCallback((event) => {
    return {
      className: `event bg-success event-${event.id}`,
    };
  }, []);

  if (!currentView) {
    return (
      <div style={{ maxHeight: '60vh' }}>
        <p className='fs-4 fw-semibold'>Loading Appointemnt Details. </p>
        <Loader />
      </div>
    )
  }
  return (
    <div className='container-fluid my-3 full-width'>
      <ToastContainer
        position='top-center'
      />
      <div className="row justify-content-center border border-2 rounded-4 p-3 bg-white">
        <div className="col-md-12">
          {rescheduling ? (
            <DnDCalendar
              localizer={localizer}
              defaultDate={currentDate}
              defaultView={currentView}
              views={[currentView]}
              events={events}
              style={currentView === 'month' ? { height: 700 } : {}}
              eventPropGetter={eventPropGetter}
              step={15}
              onEventDrop={handleEventDrop}
              toolbar={false}
              className={'pt-5'}
              resizable={false}
            />
          ) : (
            <Calendar
              localizer={localizer}
              defaultDate={currentDate}
              defaultView={currentView ? currentView : 'month'}
              views={['week', 'month', 'agenda']}
              events={events}
              eventPropGetter={eventPropGetter}
              style={currentView === 'month' ? { height: 700 } : {}}
              onRangeChange={handleRangeChange}
              onSelectEvent={(event) => navigate('/appointments/detail', { state: { id: event.id } })}
              step={15}
            />
          )}
        </div>
        <div className={`mt-3 ${currentView === 'agenda' ? 'd-none' : 'd-block'}`}>
          {rescheduling ?
            (
              <div>
                <button className='btn btn-primary btn-lg me-3' onClick={() => handleSaveRescheduledEvent()}>Confirm</button>
                <button className='btn btn-secondary btn-lg' onClick={() => { handleRescheduling(false); returnOriginalEvent(); }}>Cancel</button>
              </div>
            ) : (
              <div>
                <button className='btn btn-primary btn-lg' id='rescheduleBtn' onClick={() => handleRescheduling(true)}>Reschedule</button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default AppointmentReschedule;
