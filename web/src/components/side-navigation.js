import React from "react";
import { useState } from 'react'; 
import '../styles/sidebar.css'
import { BellFill,BoxArrowRight,GlobeAmericas,HouseFill, PersonFill,CalendarFill, Stars, ArrowsAngleExpand, ArrowsAngleContract } from "react-bootstrap-icons";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
function SideNav(){
const [collapsed, setCollapsed] = useState(true); // Initialize the 'collapsed' state

const toggleCollapse = () => {
  setCollapsed(!collapsed);
};

return(
    <div className={`nav ${collapsed ? '' : 'expanded'}`}>
    <Sidebar 
        collapsed={collapsed}
        backgroundColor="#00ff00"
        className="nav"
    >   
        <Menu>
            <MenuItem 
            onClick={toggleCollapse}
            >{collapsed? <ArrowsAngleExpand />:<ArrowsAngleContract className="icon"/>}</MenuItem>
            <MenuItem icon={<HouseFill/>}> Home </MenuItem>
            <MenuItem icon={<CalendarFill/>}> Appointment </MenuItem>
            <MenuItem icon={<BellFill/>}> Notification </MenuItem>
            <MenuItem icon={<PersonFill/>}> Profile </MenuItem>
            <MenuItem icon={<GlobeAmericas/>}> Explore </MenuItem>
            <MenuItem icon={<Stars/>}> Try-On </MenuItem>
            <SubMenu label="Example Sub Menu">
              <MenuItem> Example 1 </MenuItem>
              <MenuItem> Example 2 </MenuItem>
            </SubMenu>
        </Menu>

        <Menu className="bottom-menu">
          <MenuItem icon={<BoxArrowRight/>} rootStyles={collapsed?{width:"80px"}:{width:"250px"}}>Logout </MenuItem>
        </Menu>

    </Sidebar>
    </div>
);
}
export default SideNav;