"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const res = await axios.get("http://localhost:8000/workout/stats");
    setStats(res.data);
  };

  if (!stats) return <p>Loading...</p>;

  const data = {
    labels: ["Session1", "Session2", "Session3"],
    datasets: [
      {
        label: "Reps Progress",
        data: [10, 20, stats.total_reps],
      },
    ],
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Fitness Dashboard</h1>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-5 mt-5">
        <div className="bg-blue-500 p-5 text-white rounded">
          Total Reps: {stats.total_reps}
        </div>

        <div className="bg-green-500 p-5 text-white rounded">
          Avg Score: {stats.avg_score}
        </div>

        <div className="bg-purple-500 p-5 text-white rounded">
          Last Workout: Curl
        </div>
      </div>

      {/* CHART */}
      <div className="mt-10">
        <Line data={data} />
      </div>
    </div>
  );
}