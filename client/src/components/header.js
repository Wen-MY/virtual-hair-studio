import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css'
import { PersonSquare } from 'react-bootstrap-icons';


const Header = () => {
  const getUsername = () => {
    try {
      const storedUserData = sessionStorage.getItem('userInfo');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        return userData.username;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }

    return "Guest";
  };
  //<Link to={getUsername() !== "Guest" ? "/profile" : "/sign-in"}>
  return (
    <div>
    <header className='header'>
      <div className='logo'>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1>LOGO</h1>
        </Link>
      </div>
      <div className='userIcon'>
        <Link to="/sign-in">
          <PersonSquare size={40}/>
          <h5>{getUsername()}</h5>
        </Link>
        
      </div>
    </header>
    </div>
  );
};


export default Header;
