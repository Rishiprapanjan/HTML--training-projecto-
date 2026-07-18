import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickAdminLogin = () => {
    setUsername("admin");
    setPassword("admin123");
  };

  const handleQuickEmployeeLogin = () => {
    setUsername("emp001");
    setPassword("emp123");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username || !password) {
      setErrorMsg("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        const userSession = {
          username: "admin",
          email: "admin@company.com",
          role: "admin",
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem("userSession", JSON.stringify(userSession));
        setIsSubmitting(false);
        navigate("/admin-dashboard");
      } else if (username === "emp001" && password === "emp123") {
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
        setErrorMsg("Invalid credentials.");
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
          <h2>Portal Gateway</h2>
          <p className="subtitle">Sign in to access your dashboard</p>
        </div>

        {errorMsg && (
          <div className="animated-error-box">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username / ID</label>
            <input
              type="text"
              id="username"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
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

        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          <button type="button" className="quick-card admin-card" style={{ flex: 1 }} onClick={handleQuickAdminLogin}>
            <div className="quick-role" style={{ fontSize: "14px" }}>🔑 Admin</div>
            <div className="quick-creds">admin / admin123</div>
          </button>
          <button type="button" className="quick-card employee-card" style={{ flex: 1 }} onClick={handleQuickEmployeeLogin}>
            <div className="quick-role" style={{ fontSize: "14px" }}>👤 Employee</div>
            <div className="quick-creds">emp001 / emp123</div>
          </button>
        </div>

        <div className="divider-row" style={{ marginTop: "24px" }}>
          <span>Individual Gateways</span>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          <button className="forgot-password-link" style={{ flex: 1 }} onClick={() => navigate("/admin-login")}>
            🔑 Admin Gate
          </button>
          <button className="forgot-password-link" style={{ flex: 1 }} onClick={() => navigate("/employee-login")}>
            👤 Employee Gate
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;