import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../config';
import '../styles/header.css'
//pending replace user icon with image
const Header = () => {
  const [username, setUsername] = useState(null);
  const [userImage,setUserImage] = useState(null);
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
                setUsername(data.results.username);
                setUserImage(data.results.profilePictureUrl || '');
            } 
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    fetchUserData();
},[]);
  return (
    <header className='header'>
      <div className={username? 'logo left-indent':'logo'}>
        <Link to="/" style={{ textDecoration: 'none', }}>
          <h1>LOGO</h1>
        </Link>
      </div>
      <div className='userIcon'>
        <Link className='link' to="account/"relative="sign-in">
          {userImage? 
          (<img
            src={userImage}
            alt="Profile"
            className="user-image d-block mb-1"
          />)
          :
          (<i className='bi bi-person-circle user-icon'></i>)}
          <h6 style={{color: '#ece6ce'}}>{username?username:"Guest"}</h6>
        </Link>
      </div>
    </header>
  );
};


export default Header;
