import React from 'react';

const CalendarDay = ({ today = false, day, month, weekday }) => {
  // Get the current date
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentWeekday = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

  // Use current date if today prop is true
  if (today) {
    day = currentDay;
    month = currentMonth;
    weekday = currentWeekday;
  }

  // Get the month name
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[month];

  return (
    <div className="card" style={{ width: "200px",height: '230px'}}>
      <div className="card-header bg-primary text-white text-center">
        {currentMonthName}
      </div>
      <div className="card-body text-center">
        <h1 className="display-1">{day}</h1>
      </div>
      <div className="card-footer text-center">
        {weekday}
      </div>
    </div>
  );
};

export default CalendarDay;
