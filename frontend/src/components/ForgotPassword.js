import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./profile.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier) {
      alert("Please enter your email or phone number.");
      return;
    }

    try {
      const res = await API.post("/user/forgot-password", { identifier });
      setMessage(res.data.message); // success message from backend
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error processing request");
    }
  };

  return (
    <div className="profile-container">
      <main className="profile-content">
        <h1>Forgot Password</h1>
        <form className="profile-form" onSubmit={handleSubmit}>
          <label>Email or Phone Number</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your registered email or phone"
            required
          />

         <div className="form-actions">
  <button type="submit" className="update-btn">
    Reset Password
  </button>
  <button
    type="button"
    className="change-password-btn"
    onClick={() => navigate("/profile")} // ✅ now goes back to Profile
  >
    Back to Profile
  </button>
</div>

        </form>
        {message && <p style={{ marginTop: "15px", color: "green" }}>{message}</p>}
      </main>
    </div>
  );
};

export default ForgotPassword;
