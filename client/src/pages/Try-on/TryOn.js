import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TryOnTermPopUp from './TryOnTerm';

const TryOn = () => {
    const navigate = useNavigate();
    return(
    <div className="container-fluid my-3 full-width">
        <div className='border border-2 rounded-4 p-4 ps-5 bg-white min-height mb-4 align-items-center justify-content-center d-flex'>
            <TryOnTermPopUp onAgree={() => navigate('/try-on/hairstyle')}/>
            <button type='button' className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#termModal" >Try On</button>
        </div>
    </div>
    );
}

export default TryOn;