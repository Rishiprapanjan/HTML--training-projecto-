
import React from "react";
import {
  FaHome,
  FaUsers,
  FaUserPlus,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>EMS</h2>
      </div>

      <ul className="menu">
        <li className="active">
          <FaHome />
          <span>Dashboard</span>
        </li>

        <li>
          <FaUsers />
          <span>Employees</span>
        </li>

        <li>
          <FaUserPlus />
          <span>Add Employee</span>
        </li>

        <li>
          <FaChartBar />
          <span>Reports</span>
        </li>

        <li>
          <FaCog />
          <span>Settings</span>
        </li>
      </ul>

      <div className="sidebar-footer">
        <p>Employee Management</p>
        <small>Version 1.0</small>
      </div>
    </div>
  );
}

export default Sidebar;