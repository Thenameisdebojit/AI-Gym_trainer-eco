"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE = "";

const DIFFICULTY_COLORS = { beginner: "#22c55e", intermediate: "#f59e0b", advanced: "#ef4444" };
const CATEGORY_ICONS = { freehand: "🤸", gym: "🏋️", calisthenics: "💪" };

export default function Home() {
  const [stats, setStats] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [diet, setDiet] = useState(null);
  const [chatMsg, setChatMsg] = useState("");
  const [chatReply, setChatReply] = useState("");
  const [behavior, setBehavior] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchExercises();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`/api/workout/stats`);
      setStats(res.data);
    } catch (e) {
      setError("Backend not reachable. Make sure the API server is running.");
    } finally {
      setLoading(false);
    }
  };

  const fetchExercises = async () => {
    try {
      const res = await axios.get(`/api/recommendations`);
      setExercises(res.data);
    } catch (e) {
      console.error("Could not load exercises:", e);
    }
  };

  const getDiet = async () => {
    try {
      const res = await axios.post(`/api/diet`, { weight: 70, height: 170, goal: "gain" });
      setDiet(res.data);
    } catch (e) {
      alert("Diet service error: " + (e.message || "Unknown error"));
    }
  };

  const sendChat = async () => {
    if (!chatMsg) return;
    try {
      const res = await axios.post(`/api/chat`, { message: chatMsg });
      setChatReply(res.data.response);
    } catch (e) {
      alert("Chat error: " + (e.message || "Unknown error"));
    }
  };

  const checkBehavior = async () => {
    try {
      const res = await axios.get(`/api/behavior?days_missed=2&consistency=60`);
      setBehavior(res.data.prediction);
    } catch (e) {
      alert("Behavior check error: " + (e.message || "Unknown error"));
    }
  };

  const chartData = {
    labels: ["Session 1", "Session 2", "Session 3"],
    datasets: [
      {
        label: "Reps Progress",
        data: [10, 20, stats ? stats.total_reps : 0],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
      },
    ],
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
        AI Fitness Assistant
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>Your personal AI-powered fitness tracker</p>

      {error && (
        <div style={{ background: "#fee2e2", border: "1px solid #f87171", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: "#3b82f6", color: "white", padding: "1.5rem", borderRadius: "8px" }}>
          <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>Total Reps</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {loading ? "..." : (stats ? stats.total_reps : "N/A")}
          </div>
        </div>
        <div style={{ background: "#22c55e", color: "white", padding: "1.5rem", borderRadius: "8px" }}>
          <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>Avg Score</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {loading ? "..." : (stats ? stats.avg_score.toFixed(1) : "N/A")}
          </div>
        </div>
        <div style={{ background: "#a855f7", color: "white", padding: "1.5rem", borderRadius: "8px" }}>
          <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>Last Workout</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>Curl</div>
        </div>
      </div>

      {/* Exercises */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Exercises</h2>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          {["all", "freehand", "gym", "calisthenics"].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "0.35rem 1rem",
                borderRadius: "999px",
                border: "1px solid #d1d5db",
                cursor: "pointer",
                fontWeight: activeCategory === cat ? "700" : "400",
                background: activeCategory === cat ? "#3b82f6" : "#f9fafb",
                color: activeCategory === cat ? "white" : "#374151",
              }}
            >
              {cat === "all" ? "All" : `${CATEGORY_ICONS[cat]} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
            </button>
          ))}
        </div>
        {exercises.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>Loading exercises...</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
            {exercises
              .filter(ex => activeCategory === "all" || ex.category === activeCategory)
              .map(ex => (
                <div key={ex.id} style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "1rem",
                  background: "#fafafa",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "1.1rem" }}>{CATEGORY_ICONS[ex.category] || "🏃"}</span>
                    <span style={{
                      fontSize: "0.7rem",
                      fontWeight: "600",
                      padding: "0.1rem 0.5rem",
                      borderRadius: "999px",
                      background: DIFFICULTY_COLORS[ex.difficulty] + "22",
                      color: DIFFICULTY_COLORS[ex.difficulty],
                    }}>{ex.difficulty}</span>
                  </div>
                  <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>{ex.name}</div>
                  <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>{ex.description}</div>
                  <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                    {ex.targetMuscles?.join(", ")} · {ex.caloriesPerRep} cal/rep
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Chart */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Reps Progress</h2>
        <Line data={chartData} />
      </div>

      {/* Diet */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Diet Recommendation</h2>
        <button
          onClick={getDiet}
          style={{ background: "#3b82f6", color: "white", padding: "0.5rem 1.5rem", borderRadius: "6px", border: "none", cursor: "pointer", marginBottom: "1rem" }}
        >
          Generate Diet Plan
        </button>
        {diet && (
          <div style={{ background: "#f0fdf4", padding: "1rem", borderRadius: "6px" }}>
            <p><strong>BMI:</strong> {diet.BMI}</p>
            <p><strong>Category:</strong> {diet.Category}</p>
            <p><strong>Recommended Foods:</strong> {diet.Diet.join(", ")}</p>
          </div>
        )}
      </div>

      {/* Chatbot */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Fitness Chatbot</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            value={chatMsg}
            onChange={(e) => setChatMsg(e.target.value)}
            placeholder="e.g. I feel sad, motivate me"
            style={{ flex: 1, padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "6px" }}
          />
          <button
            onClick={sendChat}
            style={{ background: "#6366f1", color: "white", padding: "0.5rem 1.5rem", borderRadius: "6px", border: "none", cursor: "pointer" }}
          >
            Send
          </button>
        </div>
        {chatReply && (
          <div style={{ marginTop: "1rem", background: "#eff6ff", padding: "1rem", borderRadius: "6px" }}>
            {chatReply}
          </div>
        )}
      </div>

      {/* Behavior */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1.5rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Behavior Analysis</h2>
        <button
          onClick={checkBehavior}
          style={{ background: "#f59e0b", color: "white", padding: "0.5rem 1.5rem", borderRadius: "6px", border: "none", cursor: "pointer", marginBottom: "1rem" }}
        >
          Check My Consistency
        </button>
        {behavior && (
          <div style={{ background: "#fffbeb", padding: "1rem", borderRadius: "6px" }}>
            {behavior}
          </div>
        )}
      </div>
    </div>
  );
}
