import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [weightData, setWeightData] = useState([]);
  const [calorieData, setCalorieData] = useState([]);
  const [dailyCalories, setDailyCalories] = useState(0);
  const [dailyProtein, setDailyProtein] = useState(0);
  const [logForm, setLogForm] = useState({
    weight: "",
    caloriesIntake: "",
    caloriesBurned: "",
  });

  const token = localStorage.getItem("token");

  // ✅ Calculate Calories and Protein
  const calculateNutrition = (user) => {
    const { gender, weight, height, age, goal, expectedWeight, trainingLevel } = user;

    let s = gender === "male" ? 5 : -161;
    let bmr = 10 * weight + 6.25 * height - 5 * age + s;

    let activityFactor = 1.2;
    if (trainingLevel === "beginner") activityFactor = 1.375;
    else if (trainingLevel === "intermediate") activityFactor = 1.55;
    else if (trainingLevel === "advanced") activityFactor = 1.725;
    else if (trainingLevel === "athlete") activityFactor = 1.9;

    let calories = bmr * activityFactor;

    if (goal === "lose") calories -= 500;
    else if (goal === "gain") calories += 500;

    if (expectedWeight && expectedWeight !== weight) {
      const diff = expectedWeight - weight;
      const adjustment = (diff * 7700) / 60;
      calories += adjustment / 7;
    }

    let proteinFactor = 1.6;
    if (trainingLevel === "intermediate") proteinFactor = 1.8;
    else if (trainingLevel === "advanced" || trainingLevel === "athlete") proteinFactor = 2.1;

    const protein = Math.round(weight * proteinFactor);

    return { calories: Math.round(calories), protein };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await API.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(profileRes.data);

        const { calories, protein } = calculateNutrition(profileRes.data);
        setDailyCalories(calories);
        setDailyProtein(protein);

        const logsRes = await API.get("/logs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Weight Chart
        const weightChart = logsRes.data.map((log) => ({
          day: new Date(log.date).toLocaleDateString("en-US", { weekday: "short" }),
          weight: log.weight,
        }));

        // Calories Chart with Food Tracker integration
      // Replace the caloriesChart mapping inside useEffect
const caloriesChart = logsRes.data.map((log) => {
  // Sum calories from all food logs of that day
  const foodLogsForDay = log.foodLogs || [];
  const intake = foodLogsForDay.reduce((sum, f) => sum + (f.calories || 0), 0);

  return {
    day: new Date(log.date).toLocaleDateString("en-US", { weekday: "short" }),
    intake: intake,
    burned: log.caloriesBurned || 0,
  };
});

        // Nutrition Summary (logged values)
        const dailyCaloriesLogged = logsRes.data.reduce(
          (sum, log) => sum + ((log.foodLogs || []).reduce((s, f) => s + f.calories, 0)),
          0
        );
        const dailyProteinLogged = logsRes.data.reduce(
          (sum, log) =>
            sum + Math.round(((log.foodLogs || []).reduce((s, f) => s + f.calories, 0)) * 0.2 / 4),
          0
        );
        const dailyCarbsLogged = logsRes.data.reduce(
          (sum, log) =>
            sum + Math.round(((log.foodLogs || []).reduce((s, f) => s + f.calories, 0)) * 0.5 / 4),
          0
        );
        const dailyFatsLogged = logsRes.data.reduce(
          (sum, log) =>
            sum + Math.round(((log.foodLogs || []).reduce((s, f) => s + f.calories, 0)) * 0.25 / 9),
          0
        );

        setProfile((prev) => ({
          ...prev,
          dailyCaloriesLogged,
          dailyProteinLogged,
          dailyCarbsLogged,
          dailyFatsLogged,
        }));

        setWeightData(weightChart);
        setCalorieData(caloriesChart);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, [token]);

  const handleLogChange = (e) => {
    setLogForm({ ...logForm, [e.target.name]: e.target.value });
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/logs", logForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Log added successfully!");
      setLogForm({ weight: "", caloriesIntake: "", caloriesBurned: "" });
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding log");
    }
  };

  if (!profile) return <p>Loading Dashboard...</p>;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h2>💪 Fitness App</h2>
        <button onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
        <button onClick={() => navigate("/profile")}>👤 Update Profile</button>
        <button onClick={() => navigate("/food-tracker")}>🍎 Food Tracker</button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        <h1>Welcome back, {profile.name}!</h1>

        {/* Info Cards */}
        <div className="dashboard-cards">
          <div className="card highlight">
            <h3>🔥 Daily Calorie Goal</h3>
            <p>{dailyCalories} kcal</p>
          </div>
          <div className="card">
            <h3>💪 Daily Protein Goal</h3>
            <p>{dailyProtein} g</p>
          </div>
        </div>

        {/* Nutrition Summary Section */}
        <div className="nutrition-section">
          <h2>🥗 Nutrition Summary</h2>
          <div className="nutrition-cards">
            {[
              {
                label: "Calories",
                value: profile.dailyCaloriesLogged || 0,
                max: dailyCalories,
                color: "#4ac4b8",
                unit: "kcal",
              },
              {
                label: "Protein",
                value: profile.dailyProteinLogged || 0,
                max: dailyProtein,
                color: "#74ebd5",
                unit: "g",
              },
              {
                label: "Carbs",
                value: profile.dailyCarbsLogged || 0,
                max: Math.round((dailyCalories * 0.5) / 4),
                color: "#f7b731",
                unit: "g",
              },
              {
                label: "Fats",
                value: profile.dailyFatsLogged || 0,
                max: Math.round((dailyCalories * 0.25) / 9),
                color: "#eb3b5a",
                unit: "g",
              },
            ].map((nutri) => (
              <div className="nutri-card" key={nutri.label}>
                <div className="circle">
                  <CircularProgressbar
                    value={nutri.value}
                    maxValue={nutri.max}
                    text={`${Math.min(100, Math.round((nutri.value / nutri.max) * 100))}%`}
                    styles={buildStyles({
                      pathColor: nutri.color,
                      textColor: "#333",
                      trailColor: "#eee",
                      textSize: "16px",
                    })}
                  />
                </div>
                <h3>{nutri.label}</h3>
                <p>
                  {nutri.value} / {nutri.max} {nutri.unit}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <h2>📈 Weight Progress</h2>
        <LineChart
          width={Math.min(700, window.innerWidth - 40)}
          height={250}
          data={weightData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="weight" stroke="#4ac4b8" strokeWidth={3} />
        </LineChart>

        <h2>🔥 Calories Intake vs Burned</h2>
        <BarChart
          width={Math.min(700, window.innerWidth - 40)}
          height={250}
          data={calorieData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="intake" fill="#74ebd5" />
          <Bar dataKey="burned" fill="#4ac4b8" />
        </BarChart>

        {/* Log Form */}
        <div className="log-form">
          <h2>📝 Log Your Daily Fitness</h2>
          <form onSubmit={handleLogSubmit}>
            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              value={logForm.weight}
              onChange={handleLogChange}
              required
            />
            <input
              type="number"
              name="caloriesIntake"
              placeholder="Calories Intake"
              value={logForm.caloriesIntake}
              onChange={handleLogChange}
            />
            <input
              type="number"
              name="caloriesBurned"
              placeholder="Calories Burned"
              value={logForm.caloriesBurned}
              onChange={handleLogChange}
            />
            <button type="submit">Add Log</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
