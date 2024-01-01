// Logout.js
import config from "../config";

const Logout = () => {
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
        // Redirect to the login page
        window.location.href= '/account/sign-in';
        
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
