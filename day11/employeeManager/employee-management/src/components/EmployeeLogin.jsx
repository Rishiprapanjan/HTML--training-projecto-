import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeLogin() {
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickLogin = () => {
    setEmployeeId("emp001");
    setPassword("emp123");
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
      if (employeeId === "emp001" && password === "emp123") {
        const userSession = {
          username: "emp001",
          email: "emp123@company.com",
          role: "employee",
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem("userSession", JSON.stringify(userSession));
        setIsSubmitting(false);
        navigate("/employee-dashboard");
      } else {
        alert("Invalid Login Details");
        setErrorMsg("Invalid Employee credentials.");
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
          <h2>Employee Workspace</h2>
          <p className="subtitle">Sign in to access your self-service portal</p>
        </div>

        {errorMsg && (
          <div className="animated-error-box">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="employeeId">Employee ID</label>
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

        <button type="button" className="quick-card employee-card" onClick={handleQuickLogin}>
          <div className="quick-role">👤 Employee Access</div>
          <div className="quick-creds">ID: emp001 | Pass: emp123</div>
        </button>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button className="forgot-password-link" onClick={() => navigate("/admin-login")}>
            Switch to Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeLogin;
