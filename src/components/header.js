import React from 'react';
import '../styles/header.css'
import { PersonSquare } from 'react-bootstrap-icons';

const Header = () => {
  return (
    <div>
    <header className='header'>
      <div className='logo'>
        <h1>LOGO</h1>
      </div>
      <div className='userIcon'>
        <PersonSquare size={50}/>
      </div>
    </header>
    </div>
  );
};


export default Header;
