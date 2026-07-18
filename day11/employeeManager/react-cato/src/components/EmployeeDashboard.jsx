import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
  const navigate = useNavigate();
  
  // Active Sidebar Tab
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Local Session Info
  const [session, setSession] = useState(() => {
    return JSON.parse(localStorage.getItem("userSession") || "{}");
  });

  // Dark Mode Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Check In/Out State
  const [isCheckedIn, setIsCheckedIn] = useState(() => {
    const saved = localStorage.getItem(`checkedIn_${session.username}`);
    return saved === "true";
  });
  const [checkInTime, setCheckInTime] = useState(() => {
    return localStorage.getItem(`checkInTime_${session.username}`) || "";
  });

  // Profile Info State (Editable)
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(`profile_${session.username}`);
    return saved ? JSON.parse(saved) : {
      fullName: "Jane Doe",
      email: session.email || "emp123@company.com",
      phone: "+91 98765 43210",
      department: "Engineering",
      designation: "Frontend Developer",
      location: "San Francisco, CA",
      bio: "Frontend Specialist passionate about building clean, responsive user interfaces."
    };
  });

  // Leave Balances
  const [leaveBalances, setLeaveBalances] = useState(() => {
    const saved = localStorage.getItem(`leaveBalances_${session.username}`);
    return saved ? JSON.parse(saved) : { annual: 12, sick: 5, casual: 8 };
  });

  // Shared Leave Applications List
  const [leaveApplications, setLeaveApplications] = useState(() => {
    const saved = localStorage.getItem("leaveRequests");
    const allRequests = saved ? JSON.parse(saved) : [
      { id: 1, employeeId: "emp001", name: "Jane Doe", type: "Annual", start: "2026-08-01", end: "2026-08-05", status: "Approved", reason: "Family Vacation" }
    ];
    if (!saved) {
      localStorage.setItem("leaveRequests", JSON.stringify(allRequests));
    }
    return allRequests.filter(req => req.employeeId === session.username);
  });

  // Notifications List State
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(`notifications_${session.username}`);
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Welcome to Aura HR Portal! Explore your dashboard.", time: "Just now", read: false },
      { id: 2, text: "Annual leave request for next month is approved.", time: "1 day ago", read: true }
    ];
  });
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Leave Form Input States
  const [leaveType, setLeaveType] = useState("Annual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");

  // Shared Attendance Records
  const [attendanceLog, setAttendanceLog] = useState(() => {
    const saved = localStorage.getItem("globalAttendance");
    const allAttendance = saved ? JSON.parse(saved) : [
      { employeeId: "emp001", name: "Jane Doe", date: "2026-07-16", checkIn: "09:05 AM", checkOut: "05:30 PM", status: "Present" },
      { employeeId: "emp001", name: "Jane Doe", date: "2026-07-15", checkIn: "08:58 AM", checkOut: "06:02 PM", status: "Present" },
      { employeeId: "emp001", name: "Jane Doe", date: "2026-07-14", checkIn: "09:12 AM", checkOut: "05:45 PM", status: "Late" }
    ];
    if (!saved) {
      localStorage.setItem("globalAttendance", JSON.stringify(allAttendance));
    }
    return allAttendance.filter(log => log.employeeId === session.username);
  });

  // Dynamic Announcements from LocalStorage
  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem("globalAnnouncements");
    if (saved) return JSON.parse(saved);
    const initial = [
      { id: 1, title: "Q3 Town Hall Meeting", content: "Join us on July 25th at 4 PM for the Q3 town hall sync.", date: "July 17", category: "Town Hall", author: "HR Team" },
      { id: 2, title: "Office Renovation Plan", content: "The 3rd floor workspace will undergo layout improvements next week.", date: "July 15", category: "Office Update", author: "Operations" },
      { id: 3, title: "Updated Remote Work Policy", content: "From August 1st, employees can choose to work remotely up to 3 days per week with manager coordination.", date: "July 10", category: "Policy", author: "Management" }
    ];
    localStorage.setItem("globalAnnouncements", JSON.stringify(initial));
    return initial;
  });

  // Sync theme
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Sync Notifications to LocalStorage
  useEffect(() => {
    localStorage.setItem(`notifications_${session.username}`, JSON.stringify(notifications));
  }, [notifications, session.username]);

  // Listen to external storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedLeaves = localStorage.getItem("leaveRequests");
      if (savedLeaves) {
        setLeaveApplications(JSON.parse(savedLeaves).filter(req => req.employeeId === session.username));
      }
      const savedAttendance = localStorage.getItem("globalAttendance");
      if (savedAttendance) {
        setAttendanceLog(JSON.parse(savedAttendance).filter(log => log.employeeId === session.username));
      }
      const savedAnnouncements = localStorage.getItem("globalAnnouncements");
      if (savedAnnouncements) {
        setAnnouncements(JSON.parse(savedAnnouncements));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 2000);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [session.username]);

  // Handle Log Out
  const handleLogout = () => {
    localStorage.removeItem("userSession");
    navigate("/");
  };

  // Profile Save handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem(`profile_${session.username}`, JSON.stringify(profile));
    
    // Add Notification
    const newNotif = {
      id: Date.now(),
      text: "Your profile information was updated successfully.",
      time: "Just now",
      read: false
    };
    setNotifications([newNotif, ...notifications]);
    
    alert("Profile information updated successfully!");
  };

  // Leave Application Form submission
  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !leaveReason) {
      alert("Please fill out all fields.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysRequested = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (daysRequested <= 0) {
      alert("End date must be after or equal to Start date.");
      return;
    }

    // Check balance
    const currentBalance = leaveBalances[leaveType.toLowerCase()];
    if (daysRequested > currentBalance) {
      alert(`Insufficient balance. You requested ${daysRequested} days, but only have ${currentBalance} left.`);
      return;
    }

    // Deduct Balance
    const newBalances = {
      ...leaveBalances,
      [leaveType.toLowerCase()]: currentBalance - daysRequested
    };
    setLeaveBalances(newBalances);
    localStorage.setItem(`leaveBalances_${session.username}`, JSON.stringify(newBalances));

    // Append to global leaves
    const newApplication = {
      id: Date.now(),
      employeeId: session.username,
      name: profile.fullName,
      type: leaveType,
      start: startDate,
      end: endDate,
      status: "Pending",
      reason: leaveReason
    };
    
    const saved = localStorage.getItem("leaveRequests");
    const allRequests = saved ? JSON.parse(saved) : [];
    const updatedGlobal = [newApplication, ...allRequests];
    localStorage.setItem("leaveRequests", JSON.stringify(updatedGlobal));
    setLeaveApplications(updatedGlobal.filter(req => req.employeeId === session.username));

    // Add Notification
    const newNotif = {
      id: Date.now(),
      text: `Submitted a leave request for ${leaveType} leave starting ${startDate}.`,
      time: "Just now",
      read: false
    };
    setNotifications([newNotif, ...notifications]);

    // Reset fields
    setStartDate("");
    setEndDate("");
    setLeaveReason("");
    alert("Leave application submitted successfully!");
  };

  // Check-In toggle handler
  const handleCheckInToggle = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const now = new Date();
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15);
    const statusVal = isLate ? "Late" : "Present";

    if (!isCheckedIn) {
      setIsCheckedIn(true);
      setCheckInTime(nowStr);
      localStorage.setItem(`checkedIn_${session.username}`, "true");
      localStorage.setItem(`checkInTime_${session.username}`, nowStr);

      const newRecord = { 
        employeeId: session.username, 
        name: profile.fullName, 
        date: todayStr, 
        checkIn: nowStr, 
        checkOut: "--", 
        status: statusVal 
      };

      const saved = localStorage.getItem("globalAttendance");
      const allAttendance = saved ? JSON.parse(saved) : [];
      const updatedGlobal = [newRecord, ...allAttendance];
      localStorage.setItem("globalAttendance", JSON.stringify(updatedGlobal));
      setAttendanceLog(updatedGlobal.filter(log => log.employeeId === session.username));

      const newNotif = {
        id: Date.now(),
        text: `Checked in successfully at ${nowStr} (${statusVal})`,
        time: "Just now",
        read: false
      };
      setNotifications([newNotif, ...notifications]);
    } else {
      setIsCheckedIn(false);
      localStorage.setItem(`checkedIn_${session.username}`, "false");
      
      const saved = localStorage.getItem("globalAttendance");
      const allAttendance = saved ? JSON.parse(saved) : [];
      
      const updatedGlobal = allAttendance.map((rec) => {
        if (rec.employeeId === session.username && rec.date === todayStr && rec.checkOut === "--") {
          return { ...rec, checkOut: nowStr };
        }
        return rec;
      });
      localStorage.setItem("globalAttendance", JSON.stringify(updatedGlobal));
      setAttendanceLog(updatedGlobal.filter(log => log.employeeId === session.username));

      const newNotif = {
        id: Date.now(),
        text: `Checked out successfully at ${nowStr}`,
        time: "Just now",
        read: false
      };
      setNotifications([newNotif, ...notifications]);

      alert(`Checked Out successfully at ${nowStr}`);
    }
  };

  const holidays = [
    { name: "Independence Day", date: "Aug 15, 2026" },
    { name: "Ganesh Chaturthi", date: "Sep 15, 2026" },
    { name: "Gandhi Jayanti", date: "Oct 02, 2026" }
  ];

  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "My Profile", icon: "👤" },
    { name: "Attendance", icon: "⏱️" },
    { name: "Leave", icon: "📝" },
    { name: "Projects", icon: "🚀" },
    { name: "Salary", icon: "💰" },
    { name: "Announcements", icon: "📢" },
    { name: "Theme Settings", icon: "⚙️" }
  ];

  return (
    <div className={`admin-portal-wrapper ${isDarkMode ? "dark-theme" : "light-theme"}`}>
      
      {/* Sidebar */}
      <aside className="portal-sidebar">
        <div className="sidebar-header">
          <span className="logo-icon">💼</span>
          <span className="logo-text">AURA HR</span>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`menu-item-btn ${activeTab === item.name ? "active" : ""}`}
              onClick={() => setActiveTab(item.name)}
            >
              <span className="item-icon">{item.icon}</span>
              <span className="item-label">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer-actions">
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <span>🚪 Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="portal-main">
        
        {/* Navbar */}
        <header className="portal-navbar">
          <div className="nav-left">
            <h1>Employee Panel</h1>
            <span className="nav-separator">/</span>
            <span className="nav-breadcrumb">{activeTab}</span>
          </div>

          <div className="nav-right">
            {/* Notification Bell Dropdown */}
            <div className="nav-notification-wrapper">
              <button 
                className="nav-btn" 
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                aria-label="Toggle notifications"
              >
                🔔
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="notification-badge">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="notification-dropdown">
                  <div className="dropdown-header">
                    <h3>Notifications</h3>
                    {notifications.some(n => !n.read) && (
                      <button 
                        className="mark-all-read-btn"
                        onClick={() => {
                          setNotifications(notifications.map(n => ({ ...n, read: true })));
                        }}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="dropdown-list">
                    {notifications.length === 0 ? (
                      <div className="notif-item" style={{ textAlign: "center", color: "var(--text-sub)" }}>
                        No notifications
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`notif-item ${n.read ? "" : "unread"}`}>
                          <p>{n.text}</p>
                          <small>{n.time}</small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="nav-profile">
              <div className="avatar">JD</div>
              <div className="profile-details">
                <span className="name">{profile.fullName}</span>
                <span className="role">{profile.designation}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Portal Body */}
        <section className="portal-body">
          
          {/* 1. DASHBOARD VIEW */}
          {activeTab === "Dashboard" && (
            <div className="dashboard-grid">
              
              {/* Welcome Banner Card */}
              <div className="welcome-card-banner glass-panel">
                <div className="welcome-left">
                  <h2>Good day, {profile.fullName}!</h2>
                  <p>You have checked in at {checkInTime || "N/A"} today. Let's make it a productive day!</p>
                  <div className="welcome-actions">
                    <button 
                      className={`btn-welcome-checkin ${isCheckedIn ? "checked-in" : ""}`}
                      onClick={handleCheckInToggle}
                    >
                      {isCheckedIn ? "⏹️ Check Out" : "▶️ Check In"}
                    </button>
                  </div>
                </div>
                <div className="welcome-art">☕</div>
              </div>

              {/* Stats row */}
              <div className="stats-row">
                <div className="stat-card">
                  <div className="card-top">
                    <span className="card-lbl">Today's Attendance</span>
                    <span className="card-icon-bg">⏱️</span>
                  </div>
                  <h2>{isCheckedIn ? "Checked In" : "Checked Out"}</h2>
                  <div className="card-trend neutral">{checkInTime ? `Checked in at ${checkInTime}` : "No check in yet"}</div>
                </div>

                <div className="stat-card">
                  <div className="card-top">
                    <span className="card-lbl">Annual Leave Left</span>
                    <span className="card-icon-bg">📝</span>
                  </div>
                  <h2>{leaveBalances.annual} Days</h2>
                  <div className="card-trend neutral">Paid leaves</div>
                </div>

                <div className="stat-card">
                  <div className="card-top">
                    <span className="card-lbl">Sick Leave Left</span>
                    <span className="card-icon-bg">🏥</span>
                  </div>
                  <h2>{leaveBalances.sick} Days</h2>
                  <div className="card-trend neutral">Emergency leaves</div>
                </div>
              </div>

              {/* Details sections split */}
              <div className="dashboard-row row-2">
                <div className="dashboard-col holidays-col glass-panel">
                  <h3>Upcoming Holidays</h3>
                  <div className="holiday-list">
                    {holidays.map((h, i) => (
                      <div key={i} className="holiday-item">
                        <span className="holiday-bullet">🗓️</span>
                        <div className="holiday-desc">
                          <p className="holiday-name">{h.name}</p>
                          <small className="holiday-date">{h.date}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard-col announcements-col glass-panel">
                  <h3>Latest Announcements</h3>
                  <div className="announce-list">
                    {announcements.slice(0, 3).map((a) => (
                      <div key={a.id} className="announce-item">
                        <h4>{a.title}</h4>
                        <p>{a.content}</p>
                        <small>{a.date}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Quick Actions & Recent Notifications */}
              <div className="dashboard-row row-2">
                <div className="dashboard-col quick-actions-col glass-panel">
                  <h3>Quick Actions</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "16px" }}>
                    <button 
                      onClick={handleCheckInToggle}
                      className="btn-save-profile" 
                      style={{ padding: "14px", fontSize: "14px", margin: 0, background: isCheckedIn ? "var(--text-error)" : "var(--accent-gradient)", color: "white" }}
                    >
                      {isCheckedIn ? "⏹️ Check Out" : "▶️ Check In"}
                    </button>
                    <button 
                      onClick={() => setActiveTab("Leave")}
                      className="btn-save-profile" 
                      style={{ padding: "14px", fontSize: "14px", margin: 0 }}
                    >
                      📝 Request Leave
                    </button>
                    <button 
                      onClick={() => setActiveTab("My Profile")}
                      className="btn-save-profile" 
                      style={{ padding: "14px", fontSize: "14px", margin: 0 }}
                    >
                      👤 Edit Profile
                    </button>
                    <button 
                      onClick={() => setActiveTab("Salary")}
                      className="btn-save-profile" 
                      style={{ padding: "14px", fontSize: "14px", margin: 0 }}
                    >
                      💰 View Payslip
                    </button>
                  </div>
                </div>

                <div className="dashboard-col recent-notifications-col glass-panel">
                  <h3>Recent Notifications</h3>
                  <div className="announce-list" style={{ marginTop: "16px" }}>
                    {notifications.slice(0, 3).map((n) => (
                      <div 
                        key={n.id} 
                        className={`announce-item ${n.read ? "" : "unread"}`} 
                        style={{ padding: "10px", borderRadius: "8px", borderLeft: n.read ? "none" : "3px solid var(--accent-primary)" }}
                      >
                        <p style={{ margin: 0, fontSize: "13px" }}>{n.text}</p>
                        <small style={{ color: "var(--text-sub)" }}>{n.time}</small>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <p style={{ color: "var(--text-sub)", fontSize: "13.5px" }}>No recent notifications.</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 2. PROFILE VIEW (Read/Write) */}
          {activeTab === "My Profile" && (
            <div className="profile-edit-section glass-panel">
              <h3>My Profile Information</h3>
              <form onSubmit={handleSaveProfile} className="profile-form">
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={profile.fullName} 
                      onChange={(e) => setProfile({...profile, fullName: e.target.value})} 
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={profile.email} 
                      onChange={(e) => setProfile({...profile, email: e.target.value})} 
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="text" 
                      value={profile.phone} 
                      onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Office Location</label>
                    <input 
                      type="text" 
                      value={profile.location} 
                      onChange={(e) => setProfile({...profile, location: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Department</label>
                    <input type="text" value={profile.department} disabled className="disabled-input" />
                  </div>
                  <div className="form-group">
                    <label>Designation</label>
                    <input type="text" value={profile.designation} disabled className="disabled-input" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Bio / Description</label>
                  <textarea 
                    value={profile.bio} 
                    onChange={(e) => setProfile({...profile, bio: e.target.value})} 
                    rows="4"
                    style={{
                      width: "100%", 
                      background: "rgba(255, 255, 255, 0.04)", 
                      border: "1px solid var(--glass-border)", 
                      color: "var(--text-main)", 
                      borderRadius: "8px", 
                      padding: "12px", 
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <button type="submit" className="btn-save-profile">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* 3. ATTENDANCE VIEW */}
          {activeTab === "Attendance" && (
            <div className="attendance-log-section glass-panel">
              <h3>Attendance Log</h3>
              <div className="table-responsive">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceLog.map((log, index) => (
                      <tr key={index}>
                        <td>{log.date}</td>
                        <td>{log.checkIn}</td>
                        <td>{log.checkOut}</td>
                        <td>
                          <span className={`table-badge ${log.status === "Present" ? "present" : log.status === "Late" ? "late" : "absent"}`} style={{
                            background: log.status === "Present" ? "rgba(16, 185, 129, 0.15)" : log.status === "Late" ? "rgba(245, 158, 11, 0.15)" : "rgba(239, 68, 68, 0.15)",
                            color: log.status === "Present" ? "#10b981" : log.status === "Late" ? "#f59e0b" : "#ef4444"
                          }}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. LEAVE VIEW */}
          {activeTab === "Leave" && (
            <div className="leave-management-panel">
              <div className="dashboard-row">
                {/* Apply Leave form */}
                <div className="dashboard-col leave-form-col glass-panel">
                  <h3>Apply for Leave</h3>
                  <form onSubmit={handleApplyLeave} className="leave-apply-form">
                    <div className="form-group">
                      <label>Leave Type</label>
                      <select 
                        value={leaveType} 
                        onChange={(e) => setLeaveType(e.target.value)}
                        style={{
                          width: "100%", 
                          background: "rgba(255, 255, 255, 0.04)", 
                          border: "1px solid var(--glass-border)", 
                          color: "var(--text-main)", 
                          borderRadius: "8px", 
                          padding: "12px", 
                          boxSizing: "border-box"
                        }}
                      >
                        <option value="Annual">Annual Leave</option>
                        <option value="Sick">Sick Leave</option>
                        <option value="Casual">Casual Leave</option>
                      </select>
                    </div>

                    <div className="form-row-2" style={{ marginTop: "12px" }}>
                      <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginTop: "12px" }}>
                      <label>Reason</label>
                      <input 
                        type="text" 
                        value={leaveReason} 
                        placeholder="e.g. Family gathering" 
                        onChange={(e) => setLeaveReason(e.target.value)} 
                        required 
                      />
                    </div>

                    <button type="submit" className="btn-apply-leave" style={{ marginTop: "20px" }}>
                      Submit Application
                    </button>
                  </form>
                </div>

                {/* Leaves list history */}
                <div className="dashboard-col leave-history-col glass-panel">
                  <h3>Leave Applications History</h3>
                  <div className="table-responsive">
                    <table className="portal-table">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Dates</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaveApplications.map((app) => (
                          <tr key={app.id}>
                            <td>{app.type}</td>
                            <td>{app.start} to {app.end}</td>
                            <td>
                              <span className={`table-badge ${app.status === "Approved" ? "present" : app.status === "Pending" ? "pending" : "late"}`} style={{
                                background: app.status === "Approved" ? "rgba(16, 185, 129, 0.15)" : app.status === "Pending" ? "rgba(168, 85, 247, 0.15)" : "rgba(239, 68, 68, 0.15)",
                                color: app.status === "Approved" ? "#10b981" : app.status === "Pending" ? "var(--accent-primary)" : "#ef4444"
                              }}>
                                {app.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. PROJECTS VIEW */}
          {activeTab === "Projects" && (
            <div className="projects-section glass-panel">
              <h3>My Assigned Projects</h3>
              <p>Overview of active and completed client and internal projects.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "24px" }}>
                <div className="glass-panel" style={{ padding: "20px", border: "1px solid var(--glass-border)", borderRadius: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ margin: 0 }}>Project Alpha</h4>
                    <span className="table-badge present" style={{ background: "rgba(168, 85, 247, 0.2)", color: "var(--accent-secondary)" }}>Active</span>
                  </div>
                  <p style={{ fontSize: "13.5px", color: "var(--text-sub)", margin: "12px 0" }}>Enterprise Frontend UI upgrade to React 18 & Glassmorphic style.</p>
                  <div style={{ fontSize: "12px", color: "var(--text-sub)" }}>
                    <div><strong>Client:</strong> Acme Corp</div>
                    <div><strong>Deadline:</strong> Sep 30, 2026</div>
                    <div><strong>Project Lead:</strong> Sarah Connor</div>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: "20px", border: "1px solid var(--glass-border)", borderRadius: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ margin: 0 }}>Project Phoenix</h4>
                    <span className="table-badge pending" style={{ background: "rgba(234, 179, 8, 0.2)", color: "#eab308" }}>Planning</span>
                  </div>
                  <p style={{ fontSize: "13.5px", color: "var(--text-sub)", margin: "12px 0" }}>Migration of legacy PostgreSQL database clusters to secure cloud databases.</p>
                  <div style={{ fontSize: "12px", color: "var(--text-sub)" }}>
                    <div><strong>Client:</strong> Internal</div>
                    <div><strong>Deadline:</strong> Dec 15, 2026</div>
                    <div><strong>Project Lead:</strong> John Smith</div>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: "20px", border: "1px solid var(--glass-border)", borderRadius: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ margin: 0 }}>Cloud Migration</h4>
                    <span className="table-badge present">Completed</span>
                  </div>
                  <p style={{ fontSize: "13.5px", color: "var(--text-sub)", margin: "12px 0" }}>Scale infrastructure deployment workloads seamlessly onto AWS EKS.</p>
                  <div style={{ fontSize: "12px", color: "var(--text-sub)" }}>
                    <div><strong>Client:</strong> Global Tech</div>
                    <div><strong>Deadline:</strong> Jun 30, 2026</div>
                    <div><strong>Project Lead:</strong> Ellen Ripley</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. SALARY VIEW */}
          {activeTab === "Salary" && (
            <div className="salary-panel glass-panel">
              <h3>Salary & Payslips</h3>
              <div className="salary-details-box">
                <div className="salary-header-row">
                  <h4>July 2026 Earnings Statement</h4>
                  <span className="salary-net-lbl">Net Take-Home: <strong>₹68,500</strong></span>
                </div>
                <div className="salary-grid-breakdown">
                  <div className="breakdown-card">
                    <h5>Earnings</h5>
                    <div className="breakdown-row"><span>Basic Salary</span><span>₹45,000</span></div>
                    <div className="breakdown-row"><span>HRA</span><span>₹18,000</span></div>
                    <div className="breakdown-row"><span>Special Allowances</span><span>₹10,000</span></div>
                  </div>
                  <div className="breakdown-card">
                    <h5>Deductions</h5>
                    <div className="breakdown-row"><span>Provident Fund (PF)</span><span>₹3,500</span></div>
                    <div className="breakdown-row"><span>Professional Tax (PT)</span><span>₹1,000</span></div>
                    <div className="breakdown-row"><span>TDS / Tax Deducted</span><span>₹0</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. ANNOUNCEMENTS VIEW */}
          {activeTab === "Announcements" && (
            <div className="announcements-section glass-panel">
              <h3>All Announcements</h3>
              <p>Stay updated with the latest policies and team announcements.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
                {announcements.map((a) => (
                  <div key={a.id} className="announce-item" style={{ background: "rgba(255, 255, 255, 0.02)", padding: "20px", borderRadius: "8px", borderLeft: "4px solid var(--accent-primary)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <h4 style={{ margin: 0 }}>{a.title}</h4>
                      <span style={{ fontSize: "12px", color: "var(--accent-secondary)", fontWeight: "600" }}>{a.category || "General"}</span>
                    </div>
                    <p style={{ fontSize: "14px", margin: "0 0 10px 0" }}>{a.content}</p>
                    <div style={{ fontSize: "12px", color: "var(--text-sub)" }}>Published: {a.date} | By: {a.author || "HR Portal"}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. THEME SETTINGS */}
          {activeTab === "Theme Settings" && (
            <div className="theme-settings-panel glass-panel">
              <h3>Theme Preferences</h3>
              <p>Configure your workspace background appearance settings here.</p>
              <div style={{ marginTop: "24px" }}>
                <button 
                  className="theme-toggle-btn"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  style={{ width: "200px" }}
                >
                  <span className="toggle-icon">{isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}</span>
                </button>
              </div>
            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default EmployeeDashboard;
