import React from "react";
import { useState, useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import '../styles/sidebar.css'

import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import Logout from "../utils/logout.function";
import config from  '../config'
const SideNav = () => {

const [collapsed, setCollapsed] = useState(true); // Initialize the 'collapsed' state
const [menuItems, setMenuItems] = useState([]);
const navigate = useNavigate();
const location = useLocation();
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

return(
    <div className={`sidenav ${collapsed ? '' : 'expanded'}`}>
    <Sidebar 
        collapsed={collapsed}
        backgroundColor="#008170"
        className="sidenav"
    >   
        <Menu
          menuItemStyles={{
            button: ({active}) => {
              return {
                backgroundColor: active? '#009b86': undefined,'&:hover': {
                  backgroundColor: '#00685a',  // Change the color to black on hover
                },
              }
            },
          }}>
            <MenuItem 
              onClick={toggleCollapse}
              >{collapsed? <span className="bi bi-arrow-bar-right"/>:<span className="bi bi-arrow-bar-left icon"/>}
            </MenuItem>
            <div className="menu">
              {menuItems.map((item) => (
              <MenuItem key={item.id} icon={<span className={"bi bi-" + item.icon}/>} onClick={() => navigate(item.url)} active={location.pathname===item.url}>
                {item.name}
              </MenuItem>
              
            ))}
            </div>
        </Menu>

        <Menu className="bottom-menu">
          <MenuItem 
          icon={<span className="bi bi-box-arrow-right"/>} 
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
 <SubMenu label="Example Sub Menu">
              <MenuItem onClick={()=> navigate('/appointment')}> Example 1 </MenuItem>
              <MenuItem onClick={()=> navigate('/appointment')}> Example 2 </MenuItem>
            </SubMenu>           
*/