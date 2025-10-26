import React, { useState } from "react";
import API from "../services/api";
import "./Auth.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: "",
    name: "",
    gender: "",
    weight: "",
    height: "",
    goal: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = {
      emailOrMobile: formData.emailOrMobile,
      password: formData.password,
    };
    const res = await API.post("/auth/register", data);
    alert("Registered successfully! Token: " + res.data.token);
    window.location.href = "/login";
  } catch (err) {
    console.error(err.response?.data);
    alert(err.response?.data?.message || "Error registering user");
  }
};

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>💪 Fitness App</h1>
        <h2>Sign Up</h2>

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

        {/* Optional profile fields */}
        <input
          type="text"
          name="name"
          placeholder="Name (Optional)"
          value={formData.name}
          onChange={handleChange}
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="auth-input"
        >
          <option value="">Select Gender (Optional)</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
            type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="weight"
          placeholder="Weight (kg, Optional)"
          value={formData.weight}
          onChange={handleChange}
        />

        <input
          type="number"
          name="height"
          placeholder="Height (cm, Optional)"
          value={formData.height}
          onChange={handleChange}
        />

        <select
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          className="auth-input"
        >
          <option value="">Select Goal (Optional)</option>
          <option value="lose">Weight Loss</option>
          <option value="gain">Weight Gain</option>
          <option value="maintain">Maintain</option>
        </select>

        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;

