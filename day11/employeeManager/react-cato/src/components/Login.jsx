import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // Input states
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Status states
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Login trigger
  const handleQuickLogin = (role) => {
    setErrorMsg("");
    if (role === "admin") {
      setEmployeeId("admin");
      setEmail("admin@company.com");
      setPassword("admin123");
    } else {
      setEmployeeId("emp001");
      setEmail("emp123@company.com");
      setPassword("emp123");
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validate inputs are filled
    if (!employeeId || !password) {
      setErrorMsg("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);

    // Simulate database check
    setTimeout(() => {
      if (employeeId === "admin" && password === "admin123") {
        const userSession = {
          username: "admin",
          email: email || "admin@company.com",
          role: "admin",
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem("userSession", JSON.stringify(userSession));
        if (rememberMe) {
          localStorage.setItem("rememberedUser", employeeId);
        }
        setIsSubmitting(false);
        navigate("/admin-dashboard");
      } else if (employeeId === "emp001" && password === "emp123") {
        const userSession = {
          username: "emp001",
          email: email || "emp123@company.com",
          role: "employee",
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem("userSession", JSON.stringify(userSession));
        if (rememberMe) {
          localStorage.setItem("rememberedUser", employeeId);
        }
        setIsSubmitting(false);
        navigate("/employee-dashboard");
      } else {
        setErrorMsg("Invalid credentials. Please check your Details.");
        setIsSubmitting(false);
      }
    }, 800);
  };

  const handleForgotPassword = () => {
    alert("Demo: A password reset link has been dispatched to your registered email address.");
  };

  return (
    <div className="login-container">
      <div className="login-backdrop-graphics">
        <div className="graphic-circle circle-1"></div>
        <div className="graphic-circle circle-2"></div>
      </div>

      <div className="login-glass-card">
        {/* Company Header */}
        <div className="company-branding">
          <div className="premium-logo">
            <span className="logo-icon">💼</span>
            <span className="logo-text">AURA HR</span>
          </div>
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to access your dashboard</p>
        </div>

        {/* Dynamic Error Box */}
        {errorMsg && (
          <div className="animated-error-box">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="employeeId">Employee ID</label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              placeholder="e.g. emp001"
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              placeholder="name@company.com"
              onChange={(e) => setEmail(e.target.value)}
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
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="show-hide-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="forgot-password-link"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="btn-signin"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="divider-row">
          <span>Or Quick Access</span>
        </div>

        {/* Quick Login Cards */}
        <div className="quick-access-grid">
          <button
            type="button"
            className="quick-card admin-card"
            onClick={() => handleQuickLogin("admin")}
          >
            <div className="quick-role">🔑 Admin Access</div>
            <div className="quick-creds">ID: admin | Pass: admin123</div>
          </button>

          <button
            type="button"
            className="quick-card employee-card"
            onClick={() => handleQuickLogin("employee")}
          >
            <div className="quick-role">👤 Employee Access</div>
            <div className="quick-creds">ID: emp001 | Pass: emp123</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
