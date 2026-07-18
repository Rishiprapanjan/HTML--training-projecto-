import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  let session = {};
  try {
    session = JSON.parse(localStorage.getItem("userSession") || "{}");
  } catch (e) {
    console.error("Session parse error", e);
  }

  // Sidebar navigation state
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(false);

  // Theme state (Dark Mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());

  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);

  // Employee Database State
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch("https://6a4b3699f5eab0bb6b625785.mockapi.io/Employees")
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error(err));
  }, []);

  // Attendance Database State
  const [globalAttendance, setGlobalAttendance] = useState(() => {
    try {
      const saved = localStorage.getItem("globalAttendance");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { employeeId: "emp001", name: "Jane Doe", date: "2026-07-16", checkIn: "09:05 AM", checkOut: "05:30 PM", status: "Present" },
      { employeeId: "emp001", name: "Jane Doe", date: "2026-07-15", checkIn: "08:58 AM", checkOut: "06:02 PM", status: "Present" },
      { employeeId: "emp001", name: "Jane Doe", date: "2026-07-14", checkIn: "09:12 AM", checkOut: "05:45 PM", status: "Late" }
    ];
  });

  // Leave Requests Database State
  const [leaveRequests, setLeaveRequests] = useState(() => {
    try {
      const saved = localStorage.getItem("leaveRequests");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 1, employeeId: "emp001", name: "Jane Doe", type: "Annual", start: "2026-08-01", end: "2026-08-05", status: "Approved", reason: "Family Vacation" }
    ];
  });

  // Projects State
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem("globalProjects");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: "proj1", name: "Project Alpha", dept: "Engineering", lead: "Sarah Connor", deadline: "2026-09-30", status: "Active", budget: "₹1,20,000" },
      { id: "proj2", name: "Project Phoenix", dept: "Design", lead: "John Smith", deadline: "2026-12-15", status: "Planning", budget: "₹80,000" },
      { id: "proj3", name: "Cloud Migration", dept: "Engineering", lead: "Ellen Ripley", deadline: "2026-06-30", status: "Completed", budget: "₹2,50,000" }
    ];
  });

  // Announcements State
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem("globalAnnouncements");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 1, title: "Q3 Town Hall Meeting", content: "Join us on July 25th at 4 PM for the Q3 town hall sync.", date: "July 17", category: "Town Hall", author: "HR Team" },
      { id: 2, title: "Office Renovation Plan", content: "The 3rd floor workspace will undergo layout improvements next week.", date: "July 15", category: "Office Update", author: "Operations" }
    ];
  });

  // Company Settings State
  const [companySettings, setCompanySettings] = useState(() => {
    try {
      const saved = localStorage.getItem("companySettings");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      companyName: "Aura Corporation",
      officeStart: "09:00 AM",
      graceMinutes: "15",
      currency: "INR (₹)"
    };
  });

  // Admin Profile State
  const [adminProfile, setAdminProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("adminProfile");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      fullName: "Administrator",
      email: "admin@company.com",
      phone: "+91 98765 00000",
      location: "Corporate HQ, Bangalore",
      department: "Management",
      designation: "Chief Administrator",
      bio: "Overseeing daily portal operations and ensuring optimal organizational efficiency."
    };
  });

  // Calendar helper functions and variables
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const firstDay = getFirstDayOfMonth(currentDate);
  const totalDays = getDaysInMonth(currentDate);

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Jane Doe submitted a leave application request.", time: "10 mins ago", read: false },
    { id: 2, text: "System check: Database synchronized successfully.", time: "2 hrs ago", read: true }
  ]);

  // Recent Activities
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, user: "Sarah Connor", action: "checked in present", time: "09:05 AM" },
    { id: 2, user: "Jane Doe", action: "submitted Annual leave request", time: "Yesterday" }
  ]);

  const holidays = [
    { name: "Independence Day", date: "Aug 15, 2026" },
    { name: "Ganesh Chaturthi", date: "Sep 15, 2026" },
    { name: "Gandhi Jayanti", date: "Oct 02, 2026" }
  ];

  // Dynamic stats calculation
  const stats = {
    totalEmployees: employees.length,
    departments: new Set(employees.map(e => e.department)).size,
    workingEmployees: globalAttendance.filter(l => {
      const todayStr = new Date().toISOString().split("T")[0];
      return l.date === todayStr && l.status !== "Absent";
    }).length,
    attendanceRate: Math.round((globalAttendance.filter(l => l.status === "Present" || l.status === "Late").length / (globalAttendance.length || 1)) * 100),
    pendingLeaves: leaveRequests.filter(req => req.status === "Pending").length,
    employeesOnLeave: leaveRequests.filter(req => req.status === "Approved").length
  };

  // Tab switching loading transition trigger
  const handleTabSwitch = (tabName) => {
    setIsLoading(true);
    setActiveTab(tabName);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Removed local storage sync for employees

  useEffect(() => {
    localStorage.setItem("globalAttendance", JSON.stringify(globalAttendance));
  }, [globalAttendance]);

  useEffect(() => {
    localStorage.setItem("leaveRequests", JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem("globalProjects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("globalAnnouncements", JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem("companySettings", JSON.stringify(companySettings));
  }, [companySettings]);

  useEffect(() => {
    localStorage.setItem("adminProfile", JSON.stringify(adminProfile));
  }, [adminProfile]);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    if (isDarkMode) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [isDarkMode]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("userSession");
    navigate("/");
  };

  // Employee Management Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Add/Edit Form Fields
  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDept, setFormDept] = useState("Engineering");
  const [formDesig, setFormDesig] = useState("");
  const [formSalary, setFormSalary] = useState("");
  const [formDoj, setFormDoj] = useState("");
  const [formImg, setFormImg] = useState("");

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    if (!formId || !formName || !formEmail) {
      alert("Please fill ID, Name, and Email.");
      return;
    }
    const newEmp = {
      id: formId,
      name: formName,
      email: formEmail,
      phone: formPhone,
      department: formDept,
      designation: formDesig,
      salary: formSalary,
      dateOfJoining: formDoj,
      profileImage: formImg || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
    };

    try {
      if (editingEmployee) {
        const response = await fetch(`https://6a4b3699f5eab0bb6b625785.mockapi.io/Employees/${editingEmployee.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEmp)
        });
        const updated = await response.json();
        setEmployees(employees.map(emp => emp.id === updated.id ? updated : emp));
      } else {
        if (employees.some(emp => emp.id === formId)) {
          alert("Employee ID already exists!");
          return;
        }
        const response = await fetch("https://6a4b3699f5eab0bb6b625785.mockapi.io/Employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEmp)
        });
        const added = await response.json();
        setEmployees([...employees, added]);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving employee to API");
    }

    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      // Optimistic UI update for instantaneous DOM removal
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      try {
        await fetch(`https://6a4b3699f5eab0bb6b625785.mockapi.io/Employees/${id}`, {
          method: "DELETE"
        });
      } catch (err) {
        console.error("API error during delete:", err);
      }
    }
  };

  // Filters & Search
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "All" || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  // Leave approval handlers
  const handleLeaveStatusUpdate = (id, newStatus) => {
    setLeaveRequests(leaveRequests.map(req => req.id === id ? { ...req, status: newStatus } : req));
    alert(`Leave request has been ${newStatus.toLowerCase()}!`);
  };

  // Attendance manual overrides
  const handleAttendanceStatusChange = (index, newStatus) => {
    const updated = [...globalAttendance];
    updated[index].status = newStatus;
    setGlobalAttendance(updated);
    alert(`Attendance log status updated to ${newStatus}!`);
  };

  // Project manager fields
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [projName, setProjName] = useState("");
  const [projDept, setProjDept] = useState("Engineering");
  const [projLead, setProjLead] = useState("");
  const [projDeadline, setProjDeadline] = useState("");
  const [projBudget, setProjBudget] = useState("");

  const handleAddProject = (e) => {
    e.preventDefault();
    const newProj = {
      id: "proj" + (projects.length + 1),
      name: projName,
      dept: projDept,
      lead: projLead,
      deadline: projDeadline,
      status: "Active",
      budget: "₹" + Number(projBudget).toLocaleString()
    };
    setProjects([...projects, newProj]);
    setIsProjectFormOpen(false);
    setProjName("");
    setProjLead("");
    setProjDeadline("");
    setProjBudget("");
    alert("New project created successfully!");
  };

  // Announcement fields
  const [announceTitle, setAnnounceTitle] = useState("");
  const [announceContent, setAnnounceContent] = useState("");
  const [announceCategory, setAnnounceCategory] = useState("General");

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    const newAnn = {
      id: Date.now(),
      title: announceTitle,
      content: announceContent,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
      category: announceCategory,
      author: "HR Office"
    };
    setAnnouncements([newAnn, ...announcements]);
    setAnnounceTitle("");
    setAnnounceContent("");
    alert("Announcement published successfully!");
  };

  // Payroll / Salary breakdown views
  const [viewingPayslip, setViewingPayslip] = useState(null);

  // Statistics & Exports
  const totalPayrollCost = employees.reduce((sum, e) => sum + Number(e.salary || 0), 0);
  const averagePayrollSalary = employees.length ? Math.round(totalPayrollCost / employees.length) : 0;

  // Export CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Employee ID,Full Name,Email,Department,Designation,Monthly Salary,Joining Date\n";
    
    employees.forEach(e => {
      csvContent += `${e.id},"${e.name}",${e.email},${e.department},${e.designation},${e.salary},${e.dateOfJoining}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Aura_HR_Employee_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF (Print Layout triggering browser print preview)
  const handlePrintPDF = () => {
    window.print();
  };

  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Employee Management", icon: "👥" },
    { name: "Attendance", icon: "⏱️" },
    { name: "Leave Requests", icon: "📝" },
    { name: "Departments", icon: "🏢" },
    { name: "Projects", icon: "🚀" },
    { name: "Payroll", icon: "💰" },
    { name: "Reports", icon: "📈" },
    { name: "Announcements", icon: "📢" },
    { name: "Settings", icon: "⚙️" },
    { name: "Profile", icon: "👤" }
  ];

  return (
    <div className={`admin-portal-wrapper ${isDarkMode ? "dark-theme" : "light-theme"}`}>
      
      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)",
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 9999
        }}>
          <div style={{
            width: "50px", height: "50px", border: "5px solid rgba(255,255,255,0.1)",
            borderTopColor: "var(--accent-primary)", borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
          <p style={{ marginTop: "16px", color: "white", fontSize: "14px", letterSpacing: "1px", fontWeight: "600" }}>LOADING COMPONENT...</p>
        </div>
      )}

      {/* Sidebar */}
      <aside className="portal-sidebar no-print">
        <div className="sidebar-header">
          <span className="logo-icon">💼</span>
          <span className="logo-text">AURA HR</span>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`menu-item-btn ${activeTab === item.name ? "active" : ""}`}
              onClick={() => handleTabSwitch(item.name)}
            >
              <span className="item-icon">{item.icon}</span>
              <span className="item-label">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer-actions">
          <button 
            className="theme-toggle-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            <span className="toggle-icon">{isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}</span>
          </button>
          
          <button id="logoutBtn" onClick={handleLogout} className="sidebar-logout-btn">
            <span>🚪 Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="portal-main">
        
        {/* Navbar */}
        <header className="portal-navbar no-print">
          <div className="nav-left">
            <h1 className="dashboard-title">Admin Panel</h1>
            <span className="nav-separator">/</span>
            <span className="nav-breadcrumb">{activeTab}</span>
          </div>

          <div className="nav-right">
            {/* Notification Bell */}
            <div className="nav-notification-wrapper">
              <button 
                className="nav-btn bell-btn" 
                onClick={() => setShowNotifications(!showNotifications)}
              >
                🔔 <span className="notification-badge">{stats.pendingLeaves}</span>
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="dropdown-header">
                    <h3>Notifications</h3>
                    <button className="mark-all-read-btn">Mark all read</button>
                  </div>
                  <div className="dropdown-list">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`notif-item ${notif.read ? "read" : "unread"}`}>
                        <p>{notif.text}</p>
                        <small>{notif.time}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile widget */}
            <div className="nav-profile">
              <div className="avatar">AD</div>
              <div className="profile-details">
                <span className="name">{adminProfile.fullName}</span>
                <span className="role">Root Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <section className="portal-body">
          
          {/* 1. DASHBOARD VIEW */}
          {activeTab === "Dashboard" && (
            <div className="dashboard-grid">
              
              {/* Welcome Banner Card */}
              <div className="welcome-card-banner glass-panel">
                <div className="welcome-left">
                  <h2>Welcome back, {adminProfile.fullName}!</h2>
                  <p>System status is nominal. You have {stats.pendingLeaves} pending leave requests to review.</p>
                  <div className="welcome-actions">
                    <button 
                      className="btn-welcome-checkin"
                      onClick={() => handleTabSwitch("Leave Requests")}
                      style={{ background: "var(--accent-gradient)", color: "white" }}
                    >
                      📝 Review Leaves
                    </button>
                    <button 
                      className="btn-welcome-checkin"
                      onClick={() => handleTabSwitch("Employee Management")}
                    >
                      👥 Manage Employees
                    </button>
                  </div>
                </div>
                <div className="welcome-art">👑</div>
              </div>

              {/* Dashboard Cards Row */}
              <div className="stats-row">
                <div className="stat-card">
                  <div className="card-top">
                    <span className="card-lbl">Total Employees</span>
                    <span className="card-icon-bg">👥</span>
                  </div>
                  <h2>{stats.totalEmployees}</h2>
                  <div className="card-trend upward">↑ 12% from last month</div>
                </div>

                <div className="stat-card">
                  <div className="card-top">
                    <span className="card-lbl">Departments</span>
                    <span className="card-icon-bg">🏢</span>
                  </div>
                  <h2>{stats.departments}</h2>
                  <div className="card-trend neutral">Stable</div>
                </div>

                <div className="stat-card">
                  <div className="card-top">
                    <span className="card-lbl">Working Employees</span>
                    <span className="card-icon-bg">⚙️</span>
                  </div>
                  <h2>{stats.workingEmployees}</h2>
                  <div className="card-trend upward">↑ 4 active today</div>
                </div>

                <div className="stat-card">
                  <div className="card-top">
                    <span className="card-lbl">Attendance Rate</span>
                    <span className="card-icon-bg">⏱️</span>
                  </div>
                  <h2>{stats.attendanceRate}%</h2>
                  <div className="card-trend upward">↑ 1.2% this week</div>
                </div>

                <div className="stat-card">
                  <div className="card-top">
                    <span className="card-lbl">Pending Leaves</span>
                    <span className="card-icon-bg">📝</span>
                  </div>
                  <h2>{stats.pendingLeaves}</h2>
                  <div className="card-trend downward">↓ 2 processed</div>
                </div>

                <div className="stat-card">
                  <div className="card-top">
                    <span className="card-lbl">Employees On Leave</span>
                    <span className="card-icon-bg">🏖️</span>
                  </div>
                  <h2>{stats.employeesOnLeave}</h2>
                  <div className="card-trend neutral">4 scheduled</div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="dashboard-row row-2">
                <div className="dashboard-col chart-col glass-panel">
                  <h3>Attendance & Registration Growth</h3>
                  <div className="svg-chart-container">
                    <svg viewBox="0 0 500 220" className="growth-chart">
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.4"/>
                          <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.0"/>
                        </linearGradient>
                      </defs>
                      
                      <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.05)" />
                      <line x1="40" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.05)" />
                      <line x1="40" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.05)" />
                      <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.05)" />
                      
                      <path d="M 40 170 L 100 130 L 180 140 L 260 90 L 340 100 L 420 50 L 480 60 L 480 170 Z" fill="url(#areaGrad)" />
                      
                      <path d="M 40 170 L 100 130 L 180 140 L 260 90 L 340 100 L 420 50 L 480 60" fill="none" stroke="var(--accent-primary)" strokeWidth="3" />
                      
                      <circle cx="100" cy="130" r="4" fill="var(--accent-primary)" stroke="#fff" strokeWidth="1" />
                      <circle cx="260" cy="90" r="4" fill="var(--accent-primary)" stroke="#fff" strokeWidth="1" />
                      <circle cx="420" cy="50" r="4" fill="var(--accent-primary)" stroke="#fff" strokeWidth="1" />
                      
                      <text x="40" y="195" fill="var(--text-muted)" fontSize="10">Jan</text>
                      <text x="100" y="195" fill="var(--text-muted)" fontSize="10">Feb</text>
                      <text x="180" y="195" fill="var(--text-muted)" fontSize="10">Mar</text>
                      <text x="260" y="195" fill="var(--text-muted)" fontSize="10">Apr</text>
                      <text x="340" y="195" fill="var(--text-muted)" fontSize="10">May</text>
                      <text x="420" y="195" fill="var(--text-muted)" fontSize="10">Jun</text>
                      <text x="480" y="195" fill="var(--text-muted)" fontSize="10">Jul</text>
                    </svg>
                  </div>
                </div>

                <div className="dashboard-col calendar-col glass-panel">
                  <div className="calendar-header">
                    <h3>{currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}</h3>
                    <div className="cal-nav">
                      <button onClick={prevMonth}>◀</button>
                      <button onClick={nextMonth}>▶</button>
                    </div>
                  </div>
                  <div className="calendar-grid">
                    <div className="day-name">Sun</div>
                    <div className="day-name">Mon</div>
                    <div className="day-name">Tue</div>
                    <div className="day-name">Wed</div>
                    <div className="day-name">Thu</div>
                    <div className="day-name">Fri</div>
                    <div className="day-name">Sat</div>
                    
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} className="cal-day empty"></div>
                    ))}
                    
                    {Array.from({ length: totalDays }).map((_, i) => {
                      const day = i + 1;
                      const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
                      return (
                        <div key={`day-${day}`} className={`cal-day ${isToday ? "today" : ""}`}>
                          {day}
                          {day === 15 && <span className="day-event"></span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Activities & Details */}
              <div className="dashboard-row row-3">
                <div className="dashboard-col activity-col glass-panel">
                  <h3>Recent Activities</h3>
                  <div className="activity-list">
                    {recentActivities.map((act) => (
                      <div key={act.id} className="activity-item">
                        <div className="act-icon">📝</div>
                        <div className="act-details">
                          <p><strong>{act.user}</strong> {act.action}</p>
                          <small>{act.time}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard-col system-status glass-panel">
                  <h3>Portal Health</h3>
                  <div className="status-grid">
                    <div className="status-row-item">
                      <span>API Services</span>
                      <span className="badge-online">🟢 Active</span>
                    </div>
                    <div className="status-row-item">
                      <span>Database Sync</span>
                      <span className="badge-online">🟢 Synced</span>
                    </div>
                    <div className="status-row-item">
                      <span>Mail Servers</span>
                      <span className="badge-online">🟢 Online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Added Employee Panel Details */}
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

                <div className="dashboard-col quick-actions-col glass-panel">
                  <h3>Quick Actions</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "16px" }}>
                    <button 
                      onClick={() => handleTabSwitch("Employee Management")}
                      className="btn-save-profile" 
                      style={{ padding: "14px", fontSize: "14px", margin: 0 }}
                    >
                      👥 View Employees
                    </button>
                    <button 
                      onClick={() => handleTabSwitch("Leave Requests")}
                      className="btn-save-profile" 
                      style={{ padding: "14px", fontSize: "14px", margin: 0 }}
                    >
                      📝 Review Leaves
                    </button>
                    <button 
                      onClick={() => handleTabSwitch("Profile")}
                      className="btn-save-profile" 
                      style={{ padding: "14px", fontSize: "14px", margin: 0 }}
                    >
                      👤 Edit Profile
                    </button>
                    <button 
                      onClick={() => handleTabSwitch("Payroll")}
                      className="btn-save-profile" 
                      style={{ padding: "14px", fontSize: "14px", margin: 0 }}
                    >
                      💰 Payroll
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Add Employee Form and Directory for Selenium Test execution */}
              <div className="dashboard-row row-3" style={{ marginTop: "24px" }}>
                {/* Form Card */}
                <div className="dashboard-col glass-panel" style={{ flex: 1, padding: "24px", borderRadius: "12px", border: "1px solid var(--glass-border)", height: "fit-content" }}>
                  <h3>➕ Quick Add Employee</h3>
                  <form onSubmit={handleSaveEmployee} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" name="name" value={formName} onChange={e => { setFormName(e.target.value); setFormId(e.target.value ? "emp" + e.target.value.replace(/\s+/g, "").substring(0, 5) + Date.now().toString().slice(-3) : ""); }} required placeholder="e.g. Auto Tester" style={{ width: "100%", boxSizing: "border-box" }} />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" name="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} required placeholder="autotester@mail.com" style={{ width: "100%", boxSizing: "border-box" }} />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="text" name="phone" value={formPhone} onChange={e => setFormPhone(e.target.value)} required placeholder="9876543210" style={{ width: "100%", boxSizing: "border-box" }} />
                    </div>
                    <div className="form-group">
                      <label>Department</label>
                      <select name="department" value={formDept} onChange={e => setFormDept(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)", color: "var(--text-main)", borderRadius: "8px", padding: "12px" }}>
                        <option value="Engineering">Engineering</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                        <option value="IT">IT</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Designation</label>
                      <input type="text" name="designation" value={formDesig} onChange={e => setFormDesig(e.target.value)} required placeholder="QA Automation Lead" style={{ width: "100%", boxSizing: "border-box" }} />
                    </div>
                    <div className="form-group">
                      <label>Salary (₹ / month)</label>
                      <input type="number" name="salary" value={formSalary} onChange={e => setFormSalary(e.target.value)} required placeholder="85000" style={{ width: "100%", boxSizing: "border-box" }} />
                    </div>
                    <button type="submit" className="btn-signin" style={{ width: "100%" }}>Add Employee</button>
                  </form>
                </div>

                {/* Directory Card */}
                <div className="dashboard-col glass-panel" style={{ flex: 1.5, padding: "24px", borderRadius: "12px", border: "1px solid var(--glass-border)", height: "fit-content" }}>
                  <h3>📋 Employee Directory</h3>
                  <div style={{ marginTop: "16px" }}>
                    <input 
                      type="text" 
                      placeholder="Search employee..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid var(--glass-border)",
                        color: "var(--text-main)",
                        borderRadius: "8px",
                        padding: "12px",
                        fontSize: "14px",
                        marginBottom: "16px",
                        boxSizing: "border-box"
                      }}
                    />
                    <div className="employee-list-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", maxHeight: "560px", overflowY: "auto" }}>
                      {filteredEmployees.map((emp) => (
                        <div key={emp.id} className="employee-card glass-panel" style={{ padding: "16px", borderRadius: "8px", border: "1px solid var(--glass-border)", position: "relative" }}>
                          <h3 style={{ margin: "0 0 4px 0", color: "var(--text-main)" }}>{emp.name}</h3>
                          <div style={{ fontSize: "12px", color: "var(--accent-secondary)" }}>{emp.designation}</div>
                          
                          <div style={{ fontSize: "12.5px", display: "flex", flexDirection: "column", gap: "4px", textAlign: "left", marginTop: "10px", borderTop: "1px solid var(--border-color)", paddingTop: "10px" }}>
                            <div><strong>Dept:</strong> {emp.department}</div>
                            <div><strong>Email:</strong> {emp.email}</div>
                            <div><strong>Salary:</strong> ₹{Number(emp.salary || 0).toLocaleString()}</div>
                          </div>
                          
                          <div className="actions" style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                            <button 
                              className="btn-welcome-checkin edit-btn"
                              style={{ padding: "4px 8px", fontSize: "11px", background: "rgba(168, 85, 247, 0.15)" }}
                              onClick={() => {
                                setEditingEmployee(emp);
                                setFormId(emp.id);
                                setFormName(emp.name);
                                setFormEmail(emp.email);
                                setFormPhone(emp.phone);
                                setFormDept(emp.department);
                                setFormDesig(emp.designation);
                                setFormSalary(emp.salary);
                                setFormDoj(emp.dateOfJoining || "");
                                setFormImg(emp.profileImage || "");
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn-welcome-checkin delete-btn"
                              style={{ padding: "4px 8px", fontSize: "11px", background: "rgba(239, 68, 68, 0.15)", color: "var(--text-error)" }}
                              onClick={() => handleDeleteEmployee(emp.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 2. EMPLOYEE MANAGEMENT TAB */}
          {activeTab === "Employee Management" && (
            <div className="employee-mgmt-container glass-panel" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3>Employee Database</h3>
                <button 
                  className="btn-signin" 
                  style={{ width: "auto", padding: "10px 20px" }}
                  onClick={() => {
                    setEditingEmployee(null);
                    setFormId("");
                    setFormName("");
                    setFormEmail("");
                    setFormPhone("");
                    setFormDept("Engineering");
                    setFormDesig("");
                    setFormSalary("");
                    setFormDoj("");
                    setFormImg("");
                    setIsFormOpen(true);
                  }}
                >
                  ➕ Add Employee
                </button>
              </div>

              {/* Search and Filters */}
              <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
                <input 
                  type="text" 
                  placeholder="Search employee..." 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  style={{
                    flex: 1,
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--text-main)",
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "14px"
                  }}
                />
                <select 
                  value={selectedDept}
                  onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(1); }}
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--text-main)",
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "14px",
                    width: "180px"
                  }}
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="IT">IT</option>
                </select>
              </div>

              {/* Employees List Grid */}
              <div className="employee-list-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "20px" }}>
                {paginatedEmployees.map((emp) => (
                  <div key={emp.id} className="employee-card glass-panel" style={{ padding: "20px", borderRadius: "12px", border: "1px solid var(--glass-border)", position: "relative", textAlign: "center" }}>
                    <img 
                      src={emp.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
                      alt={emp.name} 
                      style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "12px", border: "2px solid var(--accent-primary)" }}
                    />
                    <h3 style={{ margin: "0 0 6px 0", color: "var(--text-main)" }}>{emp.name}</h3>
                    <div style={{ fontSize: "12.5px", color: "var(--accent-secondary)", fontWeight: "600", marginBottom: "12px" }}>{emp.designation}</div>
                    
                    <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "6px", textAlign: "left", marginBottom: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
                      <div><strong>ID:</strong> {emp.id}</div>
                      <div><strong>Dept:</strong> {emp.department}</div>
                      <div><strong>Email:</strong> {emp.email}</div>
                      <div><strong>Phone:</strong> {emp.phone || "N/A"}</div>
                      <div><strong>Salary:</strong> ₹{Number(emp.salary || 0).toLocaleString()}</div>
                    </div>

                    <div className="actions" style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      <button 
                        className="btn-welcome-checkin"
                        style={{ padding: "6px 12px", fontSize: "12px", background: "rgba(255,255,255,0.05)" }}
                        onClick={() => setViewingEmployee(emp)}
                      >
                        👁️ View
                      </button>
                      <button 
                        className="btn-welcome-checkin edit-btn"
                        style={{ padding: "6px 12px", fontSize: "12px", background: "rgba(168, 85, 247, 0.15)" }}
                        onClick={() => {
                          setEditingEmployee(emp);
                          setFormId(emp.id);
                          setFormName(emp.name);
                          setFormEmail(emp.email);
                          setFormPhone(emp.phone);
                          setFormDept(emp.department);
                          setFormDesig(emp.designation);
                          setFormSalary(emp.salary);
                          setFormDoj(emp.dateOfJoining);
                          setFormImg(emp.profileImage || "");
                          setIsFormOpen(true);
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn-welcome-checkin delete-btn"
                        style={{ padding: "6px 12px", fontSize: "12px", background: "rgba(239, 68, 68, 0.15)", color: "var(--text-error)" }}
                        onClick={() => handleDeleteEmployee(emp.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
                  <span style={{ fontSize: "14px", color: "var(--text-sub)" }}>
                    Showing page {currentPage} of {totalPages}
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                      className="btn-welcome-checkin" 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                      ◀ Previous
                    </button>
                    <button 
                      className="btn-welcome-checkin" 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    >
                      Next ▶
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. ATTENDANCE LOG VIEW */}
          {activeTab === "Attendance" && (
            <div className="attendance-mgmt-container glass-panel" style={{ padding: "24px" }}>
              <h3>Company Attendance Logs</h3>
              <p>Real-time view of check-ins and check-outs across the organization.</p>
              
              <div className="table-responsive" style={{ marginTop: "20px" }}>
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Emp ID</th>
                      <th>Name</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {globalAttendance.map((log, index) => (
                      <tr key={index}>
                        <td>{log.date}</td>
                        <td>{log.employeeId}</td>
                        <td>{log.name}</td>
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
                        <td>
                          <select 
                            value={log.status} 
                            onChange={(e) => handleAttendanceStatusChange(index, e.target.value)}
                            style={{
                              background: "rgba(255, 255, 255, 0.04)",
                              border: "1px solid var(--glass-border)",
                              color: "var(--text-main)",
                              borderRadius: "6px",
                              padding: "4px 8px",
                              fontSize: "12px"
                            }}
                          >
                            <option value="Present">Present</option>
                            <option value="Late">Late</option>
                            <option value="Absent">Absent</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. LEAVE APPROVAL VIEW */}
          {activeTab === "Leave Requests" && (
            <div className="leave-mgmt-container glass-panel" style={{ padding: "24px" }}>
              <h3>Leave Applications Directory</h3>
              <p>Review, approve or reject leave submissions from company employees.</p>

              <div className="table-responsive" style={{ marginTop: "20px" }}>
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Emp ID</th>
                      <th>Name</th>
                      <th>Leave Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.map((req) => (
                      <tr key={req.id}>
                        <td>{req.employeeId}</td>
                        <td>{req.name}</td>
                        <td>{req.type}</td>
                        <td>{req.start}</td>
                        <td>{req.end}</td>
                        <td>{req.reason}</td>
                        <td>
                          <span className={`table-badge ${req.status === "Approved" ? "present" : req.status === "Pending" ? "pending" : "late"}`} style={{
                            background: req.status === "Approved" ? "rgba(16, 185, 129, 0.15)" : req.status === "Pending" ? "rgba(168, 85, 247, 0.15)" : "rgba(239, 68, 68, 0.15)",
                            color: req.status === "Approved" ? "#10b981" : req.status === "Pending" ? "var(--accent-primary)" : "#ef4444"
                          }}>
                            {req.status}
                          </span>
                        </td>
                        <td>
                          {req.status === "Pending" ? (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button 
                                className="btn-welcome-checkin"
                                style={{ padding: "6px 12px", fontSize: "12px", background: "rgba(16, 185, 129, 0.2)", color: "#10b981" }}
                                onClick={() => handleLeaveStatusUpdate(req.id, "Approved")}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn-welcome-checkin"
                                style={{ padding: "6px 12px", fontSize: "12px", background: "rgba(239, 68, 68, 0.2)", color: "#ef4444" }}
                                onClick={() => handleLeaveStatusUpdate(req.id, "Rejected")}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: "12.5px", color: "var(--text-sub)" }}>Resolved</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. DEPARTMENTS VIEW */}
          {activeTab === "Departments" && (
            <div className="departments-container glass-panel" style={{ padding: "24px" }}>
              <h3>Departments Overview</h3>
              <p>Structure and payroll distribution details across organizational departments.</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "24px" }}>
                {["Engineering", "Design", "Marketing", "HR", "Finance"].map((dept) => {
                  const deptEmps = employees.filter(e => e.department === dept);
                  const deptAvgSal = deptEmps.length ? Math.round(deptEmps.reduce((s, e) => s + Number(e.salary || 0), 0) / deptEmps.length) : 0;
                  const deptHead = dept === "Engineering" ? "Sarah Connor" : dept === "Design" ? "John Smith" : dept === "HR" ? "Emma Wilson" : dept === "Finance" ? "Robert Downey" : "David Miller";
                  
                  return (
                    <div key={dept} className="glass-panel" style={{ padding: "20px", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
                      <h4 style={{ margin: 0 }}>🏢 {dept}</h4>
                      <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13.5px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "var(--text-sub)" }}>Department Head</span>
                          <strong>{deptHead}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "var(--text-sub)" }}>Active Employees</span>
                          <strong>{deptEmps.length}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "var(--text-sub)" }}>Average Salary</span>
                          <strong>₹{deptAvgSal.toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. PROJECTS VIEW */}
          {activeTab === "Projects" && (
            <div className="projects-container glass-panel" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3>Corporate Projects</h3>
                <button 
                  className="btn-signin" 
                  style={{ width: "auto", padding: "10px 20px" }}
                  onClick={() => setIsProjectFormOpen(true)}
                >
                  ➕ Create Project
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                {projects.map((proj) => (
                  <div key={proj.id} className="glass-panel" style={{ padding: "20px", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <h4 style={{ margin: 0 }}>🚀 {proj.name}</h4>
                      <span className="table-badge present">{proj.status}</span>
                    </div>
                    <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div><strong>Lead:</strong> {proj.lead}</div>
                      <div><strong>Dept:</strong> {proj.dept}</div>
                      <div><strong>Deadline:</strong> {proj.deadline}</div>
                      <div><strong>Budget Allocation:</strong> {proj.budget}</div>
                    </div>
                  </div>
                ))}
              </div>

              {isProjectFormOpen && (
                <div style={{
                  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                  background: "rgba(0,0,0,0.5)", backdropFilter: "blur(5px)",
                  display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
                }}>
                  <div className="glass-panel" style={{ width: "90%", maxWidth: "450px", padding: "30px" }}>
                    <h3>Create New Project</h3>
                    <form onSubmit={handleAddProject} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
                      <div className="form-group">
                        <label>Project Name</label>
                        <input type="text" value={projName} onChange={e => setProjName(e.target.value)} required placeholder="e.g. Project Phoenix" />
                      </div>
                      <div className="form-group">
                        <label>Department</label>
                        <select value={projDept} onChange={e => setProjDept(e.target.value)}>
                          <option value="Engineering">Engineering</option>
                          <option value="Design">Design</option>
                          <option value="Marketing">Marketing</option>
                          <option value="HR">HR</option>
                          <option value="Finance">Finance</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Project Lead</label>
                        <input type="text" value={projLead} onChange={e => setProjLead(e.target.value)} required placeholder="e.g. John Smith" />
                      </div>
                      <div className="form-group">
                        <label>Deadline</label>
                        <input type="date" value={projDeadline} onChange={e => setProjDeadline(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>Budget Allocation (INR)</label>
                        <input type="number" value={projBudget} onChange={e => setProjBudget(e.target.value)} required placeholder="e.g. 80000" />
                      </div>
                      
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" }}>
                        <button type="button" className="btn-welcome-checkin" onClick={() => setIsProjectFormOpen(false)}>Cancel</button>
                        <button type="submit" className="btn-signin" style={{ width: "auto", padding: "10px 24px" }}>Create</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 7. PAYROLL VIEW */}
          {activeTab === "Payroll" && (
            <div className="payroll-container glass-panel" style={{ padding: "24px" }}>
              <h3>Salary & Payroll Processing</h3>
              <p>Review monthly salaries, deductions, net pays, and view individual payslips.</p>
              
              <div className="table-responsive" style={{ marginTop: "20px" }}>
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Emp ID</th>
                      <th>Name</th>
                      <th>Designation</th>
                      <th>Gross Salary</th>
                      <th>Deductions</th>
                      <th>Net Take-Home</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => {
                      const basic = Math.round(Number(emp.salary || 0) * 0.6);
                      const hra = Math.round(Number(emp.salary || 0) * 0.25);
                      const allowance = Math.round(Number(emp.salary || 0) * 0.15);
                      const pf = Math.round(Number(emp.salary || 0) * 0.05);
                      const tax = Math.round(Number(emp.salary || 0) * 0.02);
                      const deductions = pf + tax;
                      const netSal = Number(emp.salary || 0) - deductions;

                      return (
                        <tr key={emp.id}>
                          <td>{emp.id}</td>
                          <td>{emp.name}</td>
                          <td>{emp.designation}</td>
                          <td>₹{Number(emp.salary || 0).toLocaleString()}</td>
                          <td>₹{deductions.toLocaleString()}</td>
                          <td>₹{netSal.toLocaleString()}</td>
                          <td>
                            <button 
                              className="btn-welcome-checkin"
                              style={{ padding: "6px 12px", fontSize: "12px" }}
                              onClick={() => setViewingPayslip({
                                id: emp.id,
                                name: emp.name,
                                designation: emp.designation,
                                department: emp.department,
                                basic, hra, allowance, pf, tax, deductions, netSal
                              })}
                            >
                              📄 View Payslip
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {viewingPayslip && (
                <div style={{
                  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                  background: "rgba(0,0,0,0.5)", backdropFilter: "blur(5px)",
                  display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
                }}>
                  <div className="glass-panel" style={{ width: "90%", maxWidth: "500px", padding: "30px" }}>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                      <h3>{companySettings.companyName}</h3>
                      <p style={{ margin: 0, fontSize: "13px", color: "var(--text-sub)" }}>Earnings Statement / Payslip</p>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
                      <div><strong>Employee ID:</strong> {viewingPayslip.id}</div>
                      <div><strong>Name:</strong> {viewingPayslip.name}</div>
                      <div><strong>Designation:</strong> {viewingPayslip.designation}</div>
                      <div><strong>Department:</strong> {viewingPayslip.department}</div>
                    </div>

                    <div style={{ marginTop: "16px" }}>
                      <h4 style={{ margin: "0 0 10px 0" }}>Breakdown Details</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Basic Pay (60%)</span><span>₹{viewingPayslip.basic.toLocaleString()}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>House Rent Allowance (HRA)</span><span>₹{viewingPayslip.hra.toLocaleString()}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Special Allowance</span><span>₹{viewingPayslip.allowance.toLocaleString()}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-color)", paddingTop: "8px", color: "var(--text-sub)" }}><span>Provident Fund (PF) Deduction</span><span>- ₹{viewingPayslip.pf.toLocaleString()}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-sub)" }}><span>Professional Tax (PT) Deduction</span><span>- ₹{viewingPayslip.tax.toLocaleString()}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid var(--accent-primary)", paddingTop: "10px", fontSize: "15px", fontWeight: "700" }}><span>Net Salary</span><span>₹{viewingPayslip.netSal.toLocaleString()}</span></div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                      <button className="btn-welcome-checkin" style={{ flex: 1, background: "rgba(255,255,255,0.05)" }} onClick={() => setViewingPayslip(null)}>Close</button>
                      <button className="btn-signin" style={{ flex: 1, width: "auto" }} onClick={handlePrintPDF}>🖨️ Print Payslip</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 8. REPORTS VIEW */}
          {activeTab === "Reports" && (
            <div className="reports-container glass-panel" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3>Analytics & Reports</h3>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button className="btn-welcome-checkin" onClick={handleExportCSV}>📊 Export Excel (CSV)</button>
                  <button className="btn-signin" style={{ width: "auto", padding: "10px 20px" }} onClick={handlePrintPDF}>🖨️ Print PDF Report</button>
                </div>
              </div>

              {/* Statistics row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                <div className="glass-panel" style={{ padding: "20px", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
                  <span style={{ fontSize: "14px", color: "var(--text-sub)" }}>Monthly Total Payroll Cost</span>
                  <h2 style={{ margin: "8px 0 0 0" }}>₹{totalPayrollCost.toLocaleString()}</h2>
                </div>
                <div className="glass-panel" style={{ padding: "20px", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
                  <span style={{ fontSize: "14px", color: "var(--text-sub)" }}>Average Employee Salary</span>
                  <h2 style={{ margin: "8px 0 0 0" }}>₹{averagePayrollSalary.toLocaleString()}</h2>
                </div>
              </div>

              {/* Analytical Department distribution */}
              <div className="glass-panel" style={{ padding: "20px", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
                <h4>Salary Budget Share by Department</h4>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
                  {["Engineering", "Design", "Marketing", "HR", "Finance"].map(dept => {
                    const deptSal = employees.filter(e => e.department === dept).reduce((s, e) => s + Number(e.salary || 0), 0);
                    const percent = totalPayrollCost ? Math.round((deptSal / totalPayrollCost) * 100) : 0;
                    
                    return (
                      <div key={dept}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                          <span>{dept}</span>
                          <strong>₹{deptSal.toLocaleString()} ({percent}%)</strong>
                        </div>
                        <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ width: `${percent}%`, height: "100%", background: "var(--accent-gradient)" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 9. ANNOUNCEMENTS VIEW */}
          {activeTab === "Announcements" && (
            <div className="announcements-container glass-panel" style={{ padding: "24px" }}>
              <h3>Broadcast Announcements</h3>
              <p>Publish internal updates visible to all corporate employee dashboards.</p>

              <form onSubmit={handlePostAnnouncement} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px", maxWidth: "600px" }}>
                <div className="form-group">
                  <label>Announcement Title</label>
                  <input type="text" value={announceTitle} onChange={e => setAnnounceTitle(e.target.value)} required placeholder="e.g. Q3 Town Hall Sync" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label>Category</label>
                    <select value={announceCategory} onChange={e => setAnnounceCategory(e.target.value)}>
                      <option value="General">General</option>
                      <option value="Town Hall">Town Hall</option>
                      <option value="Office Update">Office Update</option>
                      <option value="Policy">Policy</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Content Message</label>
                  <textarea rows="4" value={announceContent} onChange={e => setAnnounceContent(e.target.value)} required placeholder="Write the announcement details here..." style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--text-main)",
                    borderRadius: "8px",
                    padding: "12px",
                    boxSizing: "border-box"
                  }} />
                </div>
                <button type="submit" className="btn-signin" style={{ width: "auto", padding: "10px 30px" }}>Publish Announcement</button>
              </form>
            </div>
          )}

          {/* 10. SETTINGS VIEW */}
          {activeTab === "Settings" && (
            <div className="settings-container glass-panel" style={{ padding: "24px" }}>
              <h3>Global HR Portal Settings</h3>
              <p>Configure company properties, office timings, and theme presets.</p>

              <form onSubmit={(e) => { e.preventDefault(); localStorage.setItem("companySettings", JSON.stringify(companySettings)); alert("Company settings saved successfully!"); }} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px", maxWidth: "600px" }}>
                <div className="form-group">
                  <label>Organization Name</label>
                  <input type="text" value={companySettings.companyName} onChange={e => setCompanySettings({...companySettings, companyName: e.target.value})} required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label>Shift Start Timing</label>
                    <input type="text" value={companySettings.officeStart} onChange={e => setCompanySettings({...companySettings, officeStart: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Late Grace Time (Minutes)</label>
                    <input type="number" value={companySettings.graceMinutes} onChange={e => setCompanySettings({...companySettings, graceMinutes: e.target.value})} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Currency Format</label>
                  <input type="text" value={companySettings.currency} disabled className="disabled-input" />
                </div>
                
                <button type="submit" className="btn-signin" style={{ width: "auto", padding: "10px 30px" }}>Save Portal Settings</button>
              </form>
            </div>
          )}

          {/* 11. PROFILE VIEW */}
          {activeTab === "Profile" && (
            <div className="profile-container glass-panel" style={{ padding: "24px" }}>
              <h3>Admin Profile Information</h3>
              <p>Configure details for Root Administrator accounts.</p>

              <form onSubmit={(e) => { e.preventDefault(); localStorage.setItem("adminProfile", JSON.stringify(adminProfile)); alert("Admin Profile saved successfully!"); }} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px", maxWidth: "600px" }}>
                <div className="form-row-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label>Administrator Full Name</label>
                    <input type="text" value={adminProfile.fullName} onChange={e => setAdminProfile({...adminProfile, fullName: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" value={adminProfile.email} onChange={e => setAdminProfile({...adminProfile, email: e.target.value})} required />
                  </div>
                </div>
                <div className="form-row-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="text" value={adminProfile.phone} onChange={e => setAdminProfile({...adminProfile, phone: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" value={adminProfile.location} onChange={e => setAdminProfile({...adminProfile, location: e.target.value})} />
                  </div>
                </div>
                <div className="form-row-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label>Department</label>
                    <input type="text" value={adminProfile.department} onChange={e => setAdminProfile({...adminProfile, department: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Designation</label>
                    <input type="text" value={adminProfile.designation} onChange={e => setAdminProfile({...adminProfile, designation: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Bio / Description</label>
                  <textarea 
                    value={adminProfile.bio} 
                    onChange={(e) => setAdminProfile({...adminProfile, bio: e.target.value})} 
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
                
                <button type="submit" className="btn-signin" style={{ width: "auto", padding: "10px 30px" }}>Save Admin Profile</button>
              </form>
            </div>
          )}

        </section>

      </main>

      {/* Employee Dialog Form Modal */}
      {isFormOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(5px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: "90%", maxWidth: "600px", padding: "30px", maxHeight: "90vh", overflowY: "auto" }}>
            <h3>{editingEmployee ? "Edit Employee Details" : "Add New Employee"}</h3>
            <form onSubmit={handleSaveEmployee} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label>Employee ID</label>
                  <input 
                    type="text" 
                    value={formId} 
                    onChange={e => setFormId(e.target.value)} 
                    disabled={!!editingEmployee} 
                    required 
                    placeholder="e.g. emp007"
                  />
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formName} 
                    onChange={e => setFormName(e.target.value)} 
                    required 
                    placeholder="e.g. Robert Downey"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formEmail} 
                    onChange={e => setFormEmail(e.target.value)} 
                    required 
                    placeholder="name@company.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formPhone} 
                    onChange={e => setFormPhone(e.target.value)} 
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label>Department</label>
                  <select 
                    name="department"
                    value={formDept} 
                    onChange={e => setFormDept(e.target.value)}
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid var(--glass-border)",
                      color: "var(--text-main)",
                      borderRadius: "8px",
                      padding: "12px"
                    }}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Designation</label>
                  <input 
                    type="text" 
                    name="designation"
                    value={formDesig} 
                    onChange={e => setFormDesig(e.target.value)} 
                    required 
                    placeholder="e.g. Software Engineer"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label>Salary (₹ / month)</label>
                  <input 
                    type="number" 
                    name="salary"
                    value={formSalary} 
                    onChange={e => setFormSalary(e.target.value)} 
                    placeholder="e.g. 95000"
                  />
                </div>
                <div className="form-group">
                  <label>Date of Joining</label>
                  <input 
                    type="date" 
                    value={formDoj} 
                    onChange={e => setFormDoj(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Profile Image URL</label>
                <input 
                  type="text" 
                  value={formImg} 
                  onChange={e => setFormImg(e.target.value)} 
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" }}>
                <button 
                  type="button" 
                  className="btn-welcome-checkin"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                  onClick={() => { setIsFormOpen(false); setEditingEmployee(null); }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-signin" style={{ width: "auto", padding: "10px 24px" }}>
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {viewingEmployee && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(5px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: "90%", maxWidth: "500px", padding: "30px", textAlign: "center" }}>
            <img 
              src={viewingEmployee.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
              alt={viewingEmployee.name} 
              style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", marginBottom: "16px", border: "3px solid var(--accent-primary)" }}
            />
            <h3>{viewingEmployee.name}</h3>
            <p style={{ color: "var(--accent-secondary)", fontSize: "14px", margin: "4px 0 16px 0", fontWeight: "600" }}>{viewingEmployee.designation}</p>
            
            <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "12px", margin: "20px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                <span style={{ color: "var(--text-sub)" }}>Employee ID</span>
                <strong>{viewingEmployee.id}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                <span style={{ color: "var(--text-sub)" }}>Email</span>
                <strong>{viewingEmployee.email}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                <span style={{ color: "var(--text-sub)" }}>Phone Number</span>
                <strong>{viewingEmployee.phone || "N/A"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                <span style={{ color: "var(--text-sub)" }}>Department</span>
                <strong>{viewingEmployee.department}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                <span style={{ color: "var(--text-sub)" }}>Monthly Salary</span>
                <strong>₹{Number(viewingEmployee.salary || 0).toLocaleString()}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                <span style={{ color: "var(--text-sub)" }}>Date of Joining</span>
                <strong>{viewingEmployee.dateOfJoining || "N/A"}</strong>
              </div>
            </div>

            <button 
              className="btn-signin" 
              style={{ width: "100%", marginTop: "10px" }}
              onClick={() => setViewingEmployee(null)}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
