import React, { useState, useEffect } from "react";
import API from "../services/api";
import "./FoodTracker.css";

const FoodTracker = () => {
  const token = localStorage.getItem("token");

  const [logs, setLogs] = useState([]);
  const [selectedLogId, setSelectedLogId] = useState("");
  const [foodForm, setFoodForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  // Fetch user logs
  const fetchLogs = async () => {
    try {
      const res = await API.get("/logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleFoodChange = (e) => {
    setFoodForm({ ...foodForm, [e.target.name]: e.target.value });
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    if (!selectedLogId) return alert("Please select a log first!");

    try {
      const res = await API.post(
        `/food`,
        {
          logId: selectedLogId,
          name: foodForm.name,
          calories: Number(foodForm.calories),
          protein: Number(foodForm.protein),
          carbs: Number(foodForm.carbs),
          fats: Number(foodForm.fats),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Food added successfully!");
      setFoodForm({ name: "", calories: "", protein: "", carbs: "", fats: "" });
      fetchLogs();
    } catch (err) {
      console.error("Error adding food:", err.response?.data || err);
      alert(err.response?.data?.message || "Error adding food");
    }
  };

  return (
    <div className="food-tracker">
      <h1>🍎 Food Tracker</h1>

      <div className="log-selector">
        <label>Select Date Log:</label>
        <select
          value={selectedLogId}
          onChange={(e) => setSelectedLogId(e.target.value)}
        >
          <option value="">-- Select --</option>
          {logs.map((log) => (
            <option key={log._id} value={log._id}>
              {new Date(log.date).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      <form className="food-form" onSubmit={handleAddFood}>
        <input
          type="text"
          name="name"
          placeholder="Food Name"
          value={foodForm.name}
          onChange={handleFoodChange}
          required
        />
        <input
          type="number"
          name="calories"
          placeholder="Calories"
          value={foodForm.calories}
          onChange={handleFoodChange}
          required
        />
        <input
          type="number"
          name="protein"
          placeholder="Protein (g)"
          value={foodForm.protein}
          onChange={handleFoodChange}
        />
        <input
          type="number"
          name="carbs"
          placeholder="Carbs (g)"
          value={foodForm.carbs}
          onChange={handleFoodChange}
        />
        <input
          type="number"
          name="fats"
          placeholder="Fats (g)"
          value={foodForm.fats}
          onChange={handleFoodChange}
        />
        <button type="submit">Add Food</button>
      </form>

      <div className="food-logs">
        {logs.map((log) => (
          <div key={log._id} className="log-card">
            <h3>{new Date(log.date).toLocaleDateString()}</h3>
            {log.foodLogs?.length > 0 ? (
              <ul>
                {log.foodLogs.map((food) => (
                  <li key={food.id}>
                    {food.name} - {food.calories} kcal
                  </li>
                ))}
              </ul>
            ) : (
              <p>No food added</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodTracker;
