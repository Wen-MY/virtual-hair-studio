// Logout.js
import React from "react";

const Logout = (navigate) => {
  const handleLogout = () => {
    // Remove user info from localStorage
    localStorage.removeItem('userInfo');
    // Redirect to the login page
    navigate('/account/sign-in');
    // Reload the window (optional)
    window.location.reload();
  };

  return handleLogout;
};

export default Logout;
