import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ emailOrMobile: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // show loading
    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token); // save token
      setLoading(false);
      navigate("/dashboard"); // redirect to dashboard
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Error logging in");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>💪 Fitness App</h1>
        <h2>Login</h2>

        <input
          type="text"
          name="emailOrMobile"
          placeholder="Email or Mobile"
          value={formData.emailOrMobile}
          onChange={handleChange}
          required
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span className="toggle" onClick={togglePassword}>
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
