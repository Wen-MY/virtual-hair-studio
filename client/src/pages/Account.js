import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/loading-spinner';
import config from '../config';
import FormBox from '../components/form-box';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    const [passwordFormData, setPasswordFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

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
                    setProfilePicture(data.results.profilePictureUrl || '');
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
    //----------profile information change handling----------
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    //----------password change handling----------
    const handlePasswordInputChange = (e) => {
        setPasswordFormData({
            ...passwordFormData,
            [e.target.name]: e.target.value,
        });
    };
    const clearChangePasswordModal = () => {
        // Clear the form fields
        setPasswordFormData({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
    };
    //----------profile picture handling----------
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setProfilePictureFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };
    const clearProfilePictureModal = () => {
        setProfilePictureFile(null);
        setPreviewImage('');
    };
    //----------profile information api request----------
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
    //----------password change api request----------
    const handleChangePassword = async () => {
        try {
            if(passwordFormData.newPassword !== passwordFormData.confirmNewPassword){
                throw new Error("New Password and Confirm Password not exactly the same");
            }
            const response = await fetch(config.serverUrl + '/user/change-password', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(passwordFormData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Password changed successfully:', data.message);
                document.getElementById('closeChangePasswordModal').click();
                toast.success('Password changed successfully', { autoClose: 3000 });
            } else {
                console.error('Error changing password:', data.message);
                toast.warning(data.message, { autoClose: 3000 });
            }

        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.message, { autoClose: 3000 });
        }
    };
    //----------profile picture change api request----------
    const handleChangeProfilePicture = async () => {
        try {
            if (profilePictureFile) {
                // Upload new profile picture
                const formData = new FormData();
                formData.append('profilePicture', profilePictureFile);

                const response = await fetch(`${config.serverUrl}/user/update-profile-picture`, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Profile picture updated successfully:', data.message);
                    setProfilePicture(data.results.profilePictureUrl);
                    setPreviewImage('');
                    document.getElementById('closeProfilePictureModal').click();
                    toast.success('Profile picture updated successfully', { autoClose: 3000 });
                    window.location.reload();
                } else {
                    console.error('Error updating profile picture:', data.message);
                    toast.warning(data.message, { autoClose: 3000 });
                }
            }
        } catch (error) {
            console.error('Error updating profile picture:', error);
            toast.error(error.message, { autoClose: 3000 });
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
                    {userData.profilePictureUrl ? (
                            <img
                                src={userData.profilePictureUrl}
                                alt="Profile"
                                className="image-square-large image-cover rounded mx-auto d-block"
                                data-bs-toggle="modal"
                                data-bs-target="#changeProfilePictureModal"
                            />
                        ) : (
                            <i 
                                className="bi bi-person-square w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#changeProfilePictureModal"
                                style={{ fontSize: '100px' }}
                            />
                        )}
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text label-text-box">Email</span>
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
                <span className="input-group-text label-text-box">Username</span>
                    <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        readOnly
                    />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text label-text-box">First Name</span>
                    <input
                        type="text"
                        className="form-control"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text label-text-box">Last Name</span>
                    <input
                        type="text"
                        className="form-control"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group mb-3">
                    <label className="input-group-text label-text-box" htmlFor="genderSelect">
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
                <div className="input-group mb-3">
                        <label className="input-group-text label-text-box">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            readOnly
                            disabled
                            value="********"
                        />
                        <button
                            type="button"
                            className="btn btn-success ms-2"
                            data-bs-toggle="modal"
                            data-bs-target="#changePasswordModal"
                        >
                            Edit
                        </button>
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
            <ToastContainer 
                position='top-center'
            />
            <div className="modal fade mx-5" id="changePasswordModal" aria-labelledby="changePasswordModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="changePasswordModalLabel">Change Password</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form className="w-100">
                                <div className="form-floating mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="oldPassword"
                                        value={passwordFormData.oldPassword}
                                        onChange={handlePasswordInputChange}
                                        id="oldPassword"
                                    />
                                    <label htmlFor="oldPassword">Old Password</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="newPassword"
                                        value={passwordFormData.newPassword}
                                        onChange={handlePasswordInputChange}
                                        id="newPassword"
                                    />
                                    <label htmlFor="newPassword">New Password</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="confirmNewPassword"
                                        value={passwordFormData.confirmNewPassword}
                                        onChange={handlePasswordInputChange}
                                        id="confirmNewPassword"
                                    />
                                    <label htmlFor="confirmNewPassword">Confirm New Password</label>
                                </div>
                            </form>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleChangePassword}>
                                    Change Password
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    id="closeChangePasswordModal"
                                    onClick={clearChangePasswordModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade mx-5" id="changeProfilePictureModal" aria-labelledby="changeProfilePictureModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="changePasswordModalLabel">Update Profile Picture</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form className="w-100">
                                <div className="mb-3">
                                    {profilePictureFile && (
                                        <img
                                            src={previewImage || userData.profilePictureUrl}
                                            alt="Preview"
                                            className="img-fluid mb-3 image-cover image-square-medium"
                                        />
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="profilePictureInput" className="form-label">
                                        Select Profile Picture
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="profilePictureInput"
                                        accept="image/jpeg, image/png"
                                        onChange={handleProfilePictureChange}
                                    />
                                </div>
                            </form>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleChangeProfilePicture}>
                                    Save Change
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    id="closeProfilePictureModal"
                                    onClick={clearProfilePictureModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
