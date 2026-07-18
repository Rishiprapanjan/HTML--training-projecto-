import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickLogin = () => {
    setEmployeeId("admin");
    setPassword("admin123");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!employeeId || !password) {
      setErrorMsg("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (employeeId === "admin" && password === "admin123") {
        const userSession = {
          username: "admin",
          email: "admin@company.com",
          role: "admin",
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem("userSession", JSON.stringify(userSession));
        setIsSubmitting(false);
        navigate("/admin-dashboard");
      } else {
        alert("Invalid Login Details");
        setErrorMsg("Invalid Admin credentials.");
        setIsSubmitting(false);
      }
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-backdrop-graphics">
        <div className="graphic-circle circle-1"></div>
        <div className="graphic-circle circle-2"></div>
      </div>

      <div className="login-glass-card login-box">
        <div className="company-branding">
          <div className="premium-logo">
            <span className="logo-icon">💼</span>
            <span className="logo-text">AURA HR</span>
          </div>
          <h2>Admin Gateway</h2>
          <p className="subtitle">Sign in to manage portal resources</p>
        </div>

        {errorMsg && (
          <div className="animated-error-box">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="employeeId">Admin Username / ID</label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              placeholder="Username"
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </div>

          <div className="form-group password-group">
            <div className="password-label-row">
              <label htmlFor="password">Password</label>
            </div>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="show-hide-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-signin" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="divider-row">
          <span>Quick Access</span>
        </div>

        <button type="button" className="quick-card admin-card" onClick={handleQuickLogin}>
          <div className="quick-role">🔑 Admin Access</div>
          <div className="quick-creds">ID: admin | Pass: admin123</div>
        </button>
        
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button className="forgot-password-link" onClick={() => navigate("/employee-login")}>
            Switch to Employee Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
