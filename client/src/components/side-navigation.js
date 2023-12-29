import React from "react";
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/sidebar.css'
import { BellFill,BoxArrowRight,GlobeAmericas,HouseFill, PersonFill,CalendarFill, Stars, ArrowBarRight,ArrowBarLeft } from "react-bootstrap-icons";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Logout from "../utils/logout.function";
const SideNav = () => {

const [collapsed, setCollapsed] = useState(true); // Initialize the 'collapsed' state
const location = useLocation();
const navigate = useNavigate();

const toggleCollapse = () => {
  setCollapsed(!collapsed);
}

// Check if the current route is "/sign-in" or "/sign-up"
const isSignInOrSignUp = location.pathname === '/account/sign-in' || location.pathname === '/account/sign-up';

// If it's "/sign-in" or "/sign-up", don't render the SideNav
if (isSignInOrSignUp) {
  return null;
}

const checkLoggedInStatusAndNavigate = (path) => {
  // Check if the user is logged in based on some criteria (e.g., presence of user ID in localStorage)
  const userId = localStorage.getItem('userInfo'); // You can customize this based on your authentication mechanism

  if (!userId) {
    // User is not logged in, redirect to the login page
    navigate('/account/sign-in');
  }
  else{
    navigate(path);
  }
}
return(
    <div className={`nav ${collapsed ? '' : 'expanded'}`}>
    <Sidebar 
        collapsed={collapsed}
        backgroundColor="#008170"
        className="nav"
    >   
        <Menu>
            <MenuItem 
              onClick={toggleCollapse}
              >{collapsed? <ArrowBarRight />:<ArrowBarLeft className="icon"/>}
            </MenuItem>
            <MenuItem icon={<HouseFill/>} onClick={()=> navigate('/')}> Home </MenuItem>
            <MenuItem icon={<CalendarFill/>} onClick={()=> checkLoggedInStatusAndNavigate('/appointment')}> Appointment </MenuItem>
            <MenuItem icon={<BellFill/>} onClick={()=> checkLoggedInStatusAndNavigate('/notification')}> Notification </MenuItem>
            <MenuItem icon={<PersonFill/>} onClick={()=> checkLoggedInStatusAndNavigate('/profile')}> Profile </MenuItem>
            <MenuItem icon={<GlobeAmericas/>} onClick={()=> checkLoggedInStatusAndNavigate('/explore')}> Explore </MenuItem>
            <MenuItem icon={<Stars/>} onClick={()=> navigate('/try-on')}> Try-On </MenuItem>
            <SubMenu label="Example Sub Menu">
              <MenuItem onClick={()=> navigate('/appointment')}> Example 1 </MenuItem>
              <MenuItem onClick={()=> navigate('/appointment')}> Example 2 </MenuItem>
            </SubMenu>
        </Menu>

        <Menu className="bottom-menu">
          <MenuItem 
          icon={<BoxArrowRight/>} 
          rootStyles={collapsed?{width:"80px"}:{width:"250px"}} 
          onClick={Logout(navigate)}
          >Logout </MenuItem>
        </Menu>

    </Sidebar>
    </div>
);
}
export default SideNav;