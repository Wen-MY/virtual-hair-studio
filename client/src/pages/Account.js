import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from '../components/login.component';
import SignUp from '../components/signup.component';
import SyncLoader from 'react-spinners/SyncLoader'

const Account = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            // Simulate an asynchronous action (e.g., fetching user data)
            try {
                // Add an artificial delay (you can replace this with your actual async action)
                await new Promise(resolve => setTimeout(resolve, 1000));

                const storedUserData = sessionStorage.getItem('sessionID');
                if (storedUserData) {
                    navigate("/profile");
                } else {
                    setLoading(false); // Set loading to false if user data is not found
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false); // Set loading to false in case of an error
            }
        };

        fetchUserData();
    }, [navigate]);

    if (loading) {
        // Display a loading spinner while waiting for the asynchronous action
        return(
        <div className='loading'>
            <SyncLoader
            color="#36d7b7"
            margin={3}
            speedMultiplier={1}
            />
        </div>
        );
    }


    return (
        <div>
            <Routes>
                <Route path="sign-in" element={<Login/>} />
                <Route path="sign-up" element={<SignUp />} />
            </Routes>
        </div>
    );
};

export default Account;
