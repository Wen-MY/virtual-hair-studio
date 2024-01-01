// Logout.js
import React from "react";
import config from "../config";

const Logout = (navigate) => {
  const handleLogout = async() => {
    // Remove user session
    try {
      // Send a POST request to the logout API endpoint
      const response = await fetch(config.serverUrl + "/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include'
      });
      if(response.ok) {
        window.location.reload();
        // Redirect to the login page
        navigate('/account/sign-in');
        
      }else {
        //Redirect to Invalid Operation
        console.log("Response :" , response.status)
      }
    }catch(error) {
      console.error("Error during logout:", error);
    }
  };

  return handleLogout;
};

export default Logout;
