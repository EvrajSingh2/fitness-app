import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    gender: "",
    weight: "",
    height: "",
    goal: "",
    expectedWeight: "",
    trainingLevel: "",
    password: "",
    age: "", // ✅ added age
  });

  const [heightUnit, setHeightUnit] = useState("cm");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({
          ...res.data,
          expectedWeight: res.data.expectedWeight || "",
          trainingLevel: res.data.trainingLevel || "beginner",
          password: "",
          age: res.data.age || "", // fetch age from backend
        });
      } catch (err) {
        console.error(err);
        alert("Error fetching profile");
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert height to cm if entered in inches
    let heightInCm = profile.height;
    if (heightUnit === "inches") heightInCm = profile.height * 2.54;

    try {
      await API.put(
        "/user/profile",
        { ...profile, height: heightInCm },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Profile updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error updating profile");
    }
  };

  return (
    <div className="profile-container">
      <aside className="profile-sidebar">
        <h2>Fitness App</h2>
        <button className="side-btn" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
        <button
          className="side-btn logout"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </aside>

      <main className="profile-content">
        <h1>Update Profile</h1>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-column">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />

              <label>Gender</label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <label>Goal</label>
              <select name="goal" value={profile.goal} onChange={handleChange}>
                <option value="">Select Goal</option>
                <option value="lose">Lose Weight</option>
                <option value="gain">Gain Weight</option>
                <option value="maintain">Maintain</option>
              </select>
            </div>

            <div className="form-column">
              <label>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={profile.weight}
                onChange={handleChange}
              />

              <label>Age</label>
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
                placeholder="Enter your age"
                min="1"
                max="120"
                className="form-control"
              />

              <label>Expected Weight (kg)</label>
              <input
                type="number"
                name="expectedWeight"
                value={profile.expectedWeight}
                onChange={handleChange}
              />

              <label>Height</label>
              <div className="height-input">
                <input
                  type="number"
                  name="height"
                  value={profile.height}
                  onChange={handleChange}
                />
                <select
                  value={heightUnit}
                  onChange={(e) => setHeightUnit(e.target.value)}
                >
                  <option value="cm">cm</option>
                  <option value="inches">inches</option>
                </select>
              </div>

              <label>Training Level</label>
              <select
                name="trainingLevel"
                value={profile.trainingLevel}
                onChange={handleChange}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="update-btn">
              Update Profile
            </button>
            <button
              type="button"
              className="change-password-btn"
              onClick={() => navigate("/change-password")}
            >
              Change Password
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Profile;
