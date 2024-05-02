function formatDate(dateString) {
    let date = new Date(dateString);
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();;
    return day + "-" + month + "-" + year;
  }
  function formatTime(dateString){
    let date = new Date(dateString);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let postfix = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return hours + ":" + minutes + " " + postfix;
  }
  function formatDateInverse(dateString) {
    let date = new Date(dateString);
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();;
    return year + "-" + month + "-" + day;
  }
  function convertTo12HourFormat(timeString) {
    const [hours, minutes, seconds] = timeString.split(':');
    let postfix = 'AM';
    let formattedHours = parseInt(hours, 10);

    if (formattedHours >= 12) {
        postfix = 'PM';
        formattedHours = formattedHours === 12 ? 12 : formattedHours - 12;
    }

    return `${formattedHours}:${minutes}${seconds ? `:${seconds}` : ' '}${postfix}`;
}
  export { formatDate, formatTime, formatDateInverse,convertTo12HourFormat };