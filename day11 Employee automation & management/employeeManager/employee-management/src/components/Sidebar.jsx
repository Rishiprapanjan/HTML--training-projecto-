
import React from "react";
import {
  FaHome,
  FaUsers,
  FaUserPlus,
  FaChartBar,
  FaCog,
  FaCalendarAlt,
} from "react-icons/fa";

function Sidebar({ currentTab, setCurrentTab }) {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>EMS</h2>
      </div>

      <ul className="menu">
        <li
          className={currentTab === "dashboard" ? "active" : ""}
          onClick={() => setCurrentTab("dashboard")}
        >
          <FaHome />
          <span>Dashboard</span>
        </li>

        <li
          className={currentTab === "leaves" ? "active" : ""}
          onClick={() => setCurrentTab("leaves")}
        >
          <FaCalendarAlt />
          <span>Leave Requests</span>
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