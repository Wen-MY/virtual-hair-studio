import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TryOnTermPopUp from './TryOnTerm';
import config from '../../config';

const TryOn = () => {
    const navigate = useNavigate();
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    useEffect(() => {
        // Function to check if the user has accepted terms and conditions
        const checkTermsAcceptance = async () => {
            try {
                // Make a GET request to the server to check if user has accepted terms
                const response = await fetch(config.serverUrl + '/try-on/term/check',{
                    credentials: 'include'
                });
                if (response.ok) {
                    setAcceptedTerms(true); // User has accepted terms
                } else {
                    // User has not accepted terms, handle accordingly
                    console.log('User has not accepted terms and conditions.');
                }
            } catch (error) {
                console.error('Error checking terms acceptance:', error);
            }
        };

        checkTermsAcceptance();
    }, []);
    const handleAgreement = async () => {
        try {
            // Send a POST request to save the user session of acceptance
            const response = await fetch(config.serverUrl + '/try-on/term/accept', {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                // Update local state to reflect acceptance
                setAcceptedTerms(true);
                // Redirect user to the desired page
                navigate('/try-on/hairstyle');
            } else {
                console.error('Failed to save terms acceptance:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving terms acceptance:', error);
        }
    };
    return (
        <div className="container-fluid my-3 full-width">
            <div className='border border-2 rounded-4 p-4 ps-5 bg-white min-height mb-4 align-items-center justify-content-center d-flex'>
                {!acceptedTerms ? (
                    <React.Fragment>
                        <TryOnTermPopUp onAgree={handleAgreement} />
                        <button type='button' className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#termModal" >Try On</button>
                    </React.Fragment>
                ) : (
                    <div>
                        <Link to="/try-on/hairstyle">Try On</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TryOn;
