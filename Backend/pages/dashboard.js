import { useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [diet, setDiet] = useState(null);

  const getDiet = async () => {
    const res = await axios.post("http://localhost:8000/diet", {
      weight: 70,
      height: 170,
      goal: "gain"
    });
    setDiet(res.data);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">AI Fitness Dashboard</h1>

      <button 
        onClick={getDiet}
        className="bg-blue-500 text-white px-4 py-2 mt-5"
      >
        Generate Diet
      </button>

      {diet && (
        <div className="mt-5">
          <p>BMI: {diet.BMI}</p>
          <p>Category: {diet.Category}</p>
          <p>Diet: {diet.Diet.join(", ")}</p>
        </div>
      )}
    </div>
  );
}