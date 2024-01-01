import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css'
import { PersonSquare } from 'react-bootstrap-icons';


const Header = () => {
  
  return (
    <div>
    <header className='header'>
      <div className='logo'>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1>LOGO</h1>
        </Link>
      </div>
      <div className='userIcon'>
        <Link to="account/sign-in" style={{ textDecoration: 'none' }}>
          <PersonSquare size={40}/>
        </Link>
        
      </div>
    </header>
    </div>
  );
};


export default Header;
