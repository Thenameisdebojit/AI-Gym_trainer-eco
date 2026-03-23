export async function POST(request) {
  try {
    const body = await request.json();
    const {
      age = 25,
      gender = "male",
      height = 170,
      weight = 70,
      goal = "muscle_gain",
      activity = "moderate",
      diet_type = "vegetarian",
      budget = "medium",
      allergies = [],
    } = body;

    const res = await fetch("http://localhost:8000/diet/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ age, gender, height, weight, goal, activity, diet_type, budget, allergies }),
    });

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: "Backend unreachable. Make sure the Backend API is running." }, { status: 503 });
  }
}
