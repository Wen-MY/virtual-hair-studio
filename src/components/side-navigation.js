import React from "react";
import { useState } from 'react'; 
import '../styles/sidebar.css'
import { BoxArrowLeft,BoxArrowRight } from "react-bootstrap-icons";
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
            >{collapsed? <BoxArrowRight />:<BoxArrowLeft className="icon"/>}</MenuItem>
            <SubMenu label="Charts">
              <MenuItem> Pie charts </MenuItem>
              <MenuItem> Line charts </MenuItem>
            </SubMenu>
            <MenuItem> Documentation </MenuItem>
            <MenuItem> Calendar </MenuItem>
        </Menu>
    </Sidebar>
    </div>
);
}
export default SideNav;