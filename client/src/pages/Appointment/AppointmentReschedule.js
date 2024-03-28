import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import config from '../../config';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import '../../styles/customBigCalendar.css'

const localizer = momentLocalizer(moment);

const AppointmentReschedule = () => {
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState('month');// Initially set to month view
  const [rescheduling, setRescheduling] = useState(false);
  const DnDCalendar = withDragAndDrop(Calendar)

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
          status : appointment.status,
          id : appointment.id
        }));
        setEvents(mappedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleRangeChange = useCallback(async (range, view) => {
    setCurrentView(view);
    const today = new Date();
    let start, end;
    if (view === 'week') {
      start = moment(range[0]).startOf('week').toDate();
      end = moment(range[range.length - 1]).endOf('week').toDate();
    } else if (view === 'month') {
      start = moment(range[0]).startOf('month').toDate();
      end = moment(range[range.length - 1]).endOf('month').toDate();
    } else if (view === 'agenda') {
      start = moment(today).toDate();
      end = moment(today).add(1, 'month').endOf('month').toDate();
    }
    fetchData(start.toLocaleString(), end.toLocaleString());
  }, []);

  const handleEventDrop = useCallback(({ event, start, end }) => {
    try {
      // Update event in the client-side state directly
      setEvents(prevEvents => prevEvents.map(prevEvent =>
        prevEvent.id === event.id ? { ...prevEvent, start, end } : prevEvent
      ));
    } catch (error) {
      console.error('Error updating event:', error);
    }
  }, []);
  

  //initial fetch
  useEffect(() => {
    const today = new Date();
    fetchData(moment(today).startOf('month').toDate().toLocaleString(), moment(today).endOf('month').toDate().toLocaleString()); // Fetch data for the current day initially
  }, []);

  console.log(events);
  return (
    <div className='container-fluid my-3 full-width'>
      <div className="row justify-content-center border border-2 rounded-4 p-3 bg-white">
        <div className="col-md-12">
        {rescheduling? (
            <DnDCalendar
              localizer={localizer}
              defaultDate={new Date()}
              defaultView={currentView}
              views={[currentView]}
              events={events}
              style={{ height: 700 }}
              eventPropGetter={() => ({ className: 'event bg-success' })}
              step={15}
              onEventDrop={handleEventDrop}
            />
          ) : (
            <Calendar
              localizer={localizer}
              defaultDate={new Date()}
              defaultView="month"
              views={['week', 'month', 'agenda']}
              events={events}
              style={{ height: 700 }}
              onRangeChange={handleRangeChange}
              eventPropGetter={() => ({ className: 'event bg-success' })}
              step={15}
            />
          )}
        </div>
        <div className={`mt-3 ${currentView === 'agenda'?'d-none':'d-block'}`}>
          {rescheduling?
          (
            <div>
              <button className='btn btn-primary btn-lg me-3'>Confirm</button>
              <button className='btn btn-secondary btn-lg' onClick={()=>{setRescheduling(false)}}>Cancel</button>
            </div>
          ):(
            <div>
              <button className='btn btn-primary btn-lg' onClick={()=>{setRescheduling(true)}}>Reschedule</button>
            </div>
          )
          }
        </div>
      </div>
    </div>
  );
};

export default AppointmentReschedule;
