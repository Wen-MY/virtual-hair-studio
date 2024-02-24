// NotFound.js
import React from 'react';

const NotFound = () => {
  return (
    <div className="container-fluid my-3 full-width">
      <div className="col-md-12 border border-2 rounded-4 p-3 bg-white d-flex justify-content-center align-items-center" style={{minHeight : '80vh'}}>
        <div>
          <h1>404 Not Found</h1>
          <p>Sorry, the page you are looking for does not exist.</p>
          {/* Add any additional content or styling */}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
