import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css'
import Cookies from 'js-cookie';
//pending replace user icon with image
const Header = () => {
  const username = Cookies.get('header_username');
  return (
    <div>
    <header className='header'>
      <div className='logo'>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1>LOGO</h1>
        </Link>
      </div>
      <div className='userIcon'>
        <Link className='link' to="account/"relative="sign-in">
          <i className='bi bi-person-square user-icon'></i>
          <h6 style={{color: '#ece6ce'}}>{username?username:"Guest"}</h6>
        </Link>
        
      </div>
    </header>
    </div>
  );
};


export default Header;
