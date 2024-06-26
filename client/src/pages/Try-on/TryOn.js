import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TryOnTermPopUp from './TryOnTerm';
import config from '../../config';
import Section from '../../components/section';
const TryOn = () => {
    const navigate = useNavigate();
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    useEffect(() => {
        // Function to check if the user has accepted terms and conditions
        const checkTermsAcceptance = async () => {
            try {
                // Make a GET request to the server to check if user has accepted terms
                const response = await fetch(config.serverUrl + '/try-on/term/check', {
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
        <div>

            <Section
                background="#f8f9fa"
                title="Virtual Try On"
                paragraph="Discover the AI powered of virtual hairstyles!"
            >
                <div>
                    {!acceptedTerms ? (
                        <React.Fragment>
                            <TryOnTermPopUp onAgree={handleAgreement} />
                            <button type='button' className='btn btn-outline-primary' data-bs-toggle="modal" data-bs-target="#termModal" >Try On</button>
                        </React.Fragment>
                    ) : (
                        <div>
                            <Link to="/try-on/hairstyle" className='btn btn-outline-secondary'>Try On</Link>
                        </div>
                    )}
                </div>
            </Section>

            <Section
                background="#e9ecef"
                title="High Customization"
                paragraph="Discover a variety of options for your hair needs."
            />

            <Section
                background="#dee2e6"
                title="Thousands of Combinations"
                paragraph="Make your favorite hairstyles and color hassle-free."
            />

            <Section
                background="#ced4da"
                title="Hairstyle Recommendation"
                paragraph="Find your perfect look with current trends."
            />

            <Section
                background="#adb5bd"
                title="And More!"
                paragraph="Explore even more exciting features of Virtual Hair Studio."
            />
        </div>
    );
}

export default TryOn;
