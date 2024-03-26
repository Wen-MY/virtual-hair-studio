const formatBusinessHour = (businessHour) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayRange = businessHour.split('/')[0]; // Extract the day range part
    const timeRange = businessHour.split('/')[1]; // Extract the time range part

    // Convert day range to human-readable format
    const dayNumbers = dayRange.split('-').map(Number);
    const startDay = daysOfWeek[dayNumbers[0] - 1];
    const endDay = daysOfWeek[dayNumbers[1] - 1];
    const dayRangeFormatted = `${startDay} - ${endDay}`;

    // Convert time range to 12-hour format
    const startTime = timeRange.split('-')[0];
    const endTime = timeRange.split('-')[1];
    const startTimeFormatted = formatTime(startTime);
    const endTimeFormatted = formatTime(endTime);

    return `${startTimeFormatted} - ${endTimeFormatted} | ${dayRangeFormatted}`;
  }
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const meridiem = hours >= 12 ? 'p.m.' : 'a.m.';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes < 10 ? '0' : ''}${minutes} ${meridiem}`;
  };

  const formatContactNumber = (contact_number) => {
    // Remove any non-digit characters
    const cleanedNumber = contact_number.replace(/\D/g, '');

    // Check if the number starts with 0, if so remove it
    let formattedNumber = cleanedNumber.startsWith('0') ? cleanedNumber.slice(1) : (cleanedNumber.startsWith('0') ? cleanedNumber.slice(1) : cleanedNumber);

    // Add the country code
    formattedNumber = '+ ' + formattedNumber;

    // Add spaces for readability
    formattedNumber = formattedNumber.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3');

    return formattedNumber;
  };

  export {formatBusinessHour, formatTime, formatContactNumber};