import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../utils/loading-spinner';
import config from '../config';
import FormBox from '../components/form-box';
import Cookies from 'js-cookie';

const Account = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({});
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        gender: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            //fetching user data
            try {
                const response = await fetch(config.serverUrl + '/user/retrieve',{
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await response.json();

                if (response.ok) {
                    setUserData(data.results);
                    setFormData(data.results);
                } else {
                    console.error('Error fetching user data:', data.message);
                    if (response.status === 401) {
                        window.location.reload();
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false); // Set loading to false in case of an error
            }
        };

        fetchUserData();
    }, [navigate]);
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(config.serverUrl + '/user/update', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('User data updated successfully:', data.message);
                Cookies.set("header_username",formData.username);
                window.location.reload();
            } else {
                console.error('Error updating user data:', data.message);
                if (response.status === 401) {
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };
    
    if (loading) {
        return(
        <Loader/>
        );
    }


    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Account Information</h1>
            <FormBox>
            <form>
                <div className="input-group mb-3">
                    <span className="input-group-text">Email</span>
                    <input
                        type="text"
                        className="form-control"
                        name="email"
                        readOnly
                        disabled
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group mb-3">
                <span className="input-group-text">Username</span>
                    <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">First Name</span>
                    <input
                        type="text"
                        className="form-control"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">Last Name</span>
                    <input
                        type="text"
                        className="form-control"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group mb-3">
                    <label className="input-group-text" htmlFor="genderSelect">
                        Gender
                    </label>
                    <select
                        className="form-select"
                        id="genderSelect"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                    >
                        <option value="m">Male</option>
                        <option value="f">Female</option>
                        <option value="o">Others</option>
                    </select>
                </div>
                <button type="button" className="btn btn-primary" onClick={handleUpdate}>
                    Update
                </button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate('/')}
                >
                    Cancel
                </button>
            </form>
            </FormBox>
        </div>
    );
};

export default Account;
