import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const AppointmentReschedule = () => {
  const today = new Date();
  
  return (
    <div className='container-fluid my-3 full-width'>
      <div className="row justify-content-center border border-2 rounded-4 p-3 bg-white">
        <div className="col-md-12">
          <Calendar
            localizer={localizer}
            defaultDate={today}
            defaultView="month"
            views={['month','week','agenda']}
            events={[]} // Add your events here if needed
            style={{ height: 800 }}
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentReschedule;
