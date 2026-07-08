import React from "react";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";

function Navbar({ search, setSearch }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>👔 Employee Dashboard</h2>
      </div>

      <div className="navbar-center">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="navbar-right">
        <FaBell className="nav-icon" />
        <div className="profile">
          <FaUserCircle className="profile-icon" />
          <span>Admin</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;