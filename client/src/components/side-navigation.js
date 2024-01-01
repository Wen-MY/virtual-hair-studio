import React from "react";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/sidebar.css'
import * as Icon from "react-bootstrap-icons";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Logout from "../utils/logout.function";
import config from  '../config'
const SideNav = () => {

const [collapsed, setCollapsed] = useState(true); // Initialize the 'collapsed' state
const [menuItems, setMenuItems] = useState([]);
const navigate = useNavigate();

const toggleCollapse = () => {
  setCollapsed(!collapsed);
}

const apiUrl = config.serverUrl + '/auth/menu';
useEffect(() => {
  const fetchMenu = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setMenuItems(data.results);
      } else {
        console.error('Failed to fetch menu:', response.status);
      }
    } catch (error) {
      console.error('Error during menu fetch:', error);
    }
  };

  fetchMenu();
}, [apiUrl]);

const getIconComponent = (iconName) => {
  if (!iconName) {
    // If no iconName is provided, return the default icon
    return <Icon.CircleFill />;
  }
  // Dynamically access the icon using square brackets
  const DynamicIcon = Icon[iconName];

  // Check if the requested icon exists before rendering
  if (DynamicIcon) {
    return <DynamicIcon />;
  } else {
    console.error(`Icon '${iconName}' not found`);
    // Return a default icon or handle the case where the icon is not found
    return <Icon.CircleFill />;
  }
};


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
              >{collapsed? <Icon.ArrowBarRight />:<Icon.ArrowBarLeft className="icon"/>}
            </MenuItem>
            {menuItems.map((item) => (
            <MenuItem key={item.id} icon={getIconComponent(item.icon)} onClick={() => navigate(item.url)}>
              {item.name}
            </MenuItem>
          ))}
            
            <SubMenu label="Example Sub Menu">
              <MenuItem onClick={()=> navigate('/appointment')}> Example 1 </MenuItem>
              <MenuItem onClick={()=> navigate('/appointment')}> Example 2 </MenuItem>
            </SubMenu>
        </Menu>

        <Menu className="bottom-menu">
          <MenuItem 
          icon={<Icon.BoxArrowRight/>} 
          rootStyles={collapsed?{width:"80px"}:{width:"250px"}} 
          onClick={Logout()}
          >Logout </MenuItem>
        </Menu>

    </Sidebar>
    </div>
);
}
export default SideNav;

/*static menu deprecated
<MenuItem icon={<HouseFill/>} onClick={()=> navigate('/')}> Home </MenuItem>
            <MenuItem icon={<CalendarFill/>} onClick={()=> navigate('/appointment')}> Appointment </MenuItem>
            <MenuItem icon={<BellFill/>} onClick={()=> navigate('/notification')}> Notification </MenuItem>
            <MenuItem icon={<PersonFill/>} onClick={()=> navigate('/profile')}> Profile </MenuItem>
            <MenuItem icon={<GlobeAmericas/>} onClick={()=> navigate('/explore')}> Explore </MenuItem>
            <MenuItem icon={<Stars/>} onClick={()=> navigate('/try-on')}> Try-On </MenuItem>
            
*/