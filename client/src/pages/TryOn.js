import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';

const TryOn = () => {
    return(
    <div className="container-fluid my-3 full-width">
        <div className='border border-2 rounded-4 p-4 ps-5 bg-white min-height mb-4 align-items-center justify-content-center d-flex'>
                <Link to='/try-on/hairstyle' className='btn btn-primary'>Start Hairstyle Virtual Try-On Now</Link>
        </div>
    </div>
    );
}

export default TryOn;