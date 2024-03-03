const DateUtils = {
    // Function to convert date string to date only (YYYY-MM-DD)
    getDateOnly: (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    },
  
    // Function to convert date string to time only (HH:MM:SS)
    getTimeOnly: (dateString) => {
      const date = new Date(dateString);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    },
  
    // Function to convert date string to datetime format compatible with SQL (YYYY-MM-DD HH:MM:SS)
    getSQLDateTime: (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  };
  
  module.exports = DateUtils;
  