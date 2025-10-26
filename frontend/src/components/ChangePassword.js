import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const ChangePassword = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    try {
      await API.put(
        "/user/change-password",
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password changed successfully!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error changing password");
    }
  };

  return (
    <div className="change-password-container">
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit}>
        <label>Old Password</label>
        <input
          type="password"
          name="oldPassword"
          value={form.oldPassword}
          onChange={handleChange}
          required
        />

        <label>New Password</label>
        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          required
        />

        <label>Confirm New Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="update-btn">
          Change Password
        </button>

        <button
          type="button"
          className="forgot-password-btn"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
