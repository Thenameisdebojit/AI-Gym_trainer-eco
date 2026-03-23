"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#0A0A0F", surface: "#13131A", surfaceLight: "#1C1C28",
  border: "#2A2A3A", primary: "#00FF88", secondary: "#FF6B35",
  purple: "#A855F7", blue: "#3B82F6", amber: "#F59E0B", red: "#EF4444",
  text: "#FFFFFF", textSec: "#888899", textMuted: "#44445A",
};

const card = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "1.25rem" };
const inp = {
  background: C.surfaceLight, border: `1px solid ${C.border}`, borderRadius: 8,
  color: C.text, padding: "0.55rem 0.8rem", fontSize: "0.9rem", outline: "none", width: "100%",
};
const btn = (color = C.primary, outlined = false) => ({
  background: outlined ? "transparent" : color,
  border: `1.5px solid ${color}`,
  borderRadius: 8, color: outlined ? color : "#000",
  padding: "0.55rem 1.2rem", fontWeight: 600, fontSize: "0.9rem",
  cursor: "pointer", transition: "all 0.2s",
});

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", icon: "🏠", label: "Dashboard" },
  { id: "diet",      icon: "🥗", label: "Diet Planner" },
  { id: "exercises", icon: "💪", label: "Exercises" },
  { id: "chatbot",   icon: "🤖", label: "AI Chatbot" },
  { id: "behavior",  icon: "📊", label: "Progress" },
];

const MEAL_META = {
  breakfast:   { icon: "🌅", label: "Breakfast",          time: "7:00 – 8:00 AM" },
  mid_morning: { icon: "🍎", label: "Mid-Morning Snack",  time: "10:00 – 10:30 AM" },
  lunch:       { icon: "🍱", label: "Lunch",              time: "1:00 – 2:00 PM" },
  evening:     { icon: "🌇", label: "Evening Snack",      time: "5:00 – 5:30 PM" },
  dinner:      { icon: "🌙", label: "Dinner",             time: "8:00 – 9:00 PM" },
};

const GOAL_LABELS = { fat_loss: "🔥 Fat Loss", muscle_gain: "💪 Muscle Gain", maintenance: "⚖️ Maintenance" };
const CAT_ICONS   = {
  freehand: "🤸", gym: "🏋️", calisthenics: "💪", martial_arts: "🥊",
  yoga: "🧘", cardio: "🏃", rehab: "🩺",
};
const DIFF_COLORS = { beginner: "#22c55e", intermediate: "#f59e0b", advanced: "#ef4444" };

// ─── Main component ───────────────────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab]   = useState("dashboard");
  const [sideOpen,  setSideOpen]    = useState(true);

  // Dashboard
  const [stats,    setStats]    = useState(null);
  const [loadingSt, setLoadingSt] = useState(true);

  // Diet
  const [dietForm, setDietForm] = useState({
    age: 22, gender: "male", height: 175, weight: 70,
    goal: "muscle_gain", activity: "moderate",
    diet_type: "vegetarian", budget: "medium", allergies: "",
  });
  const [dietResult,  setDietResult]  = useState(null);
  const [dietLoading, setDietLoading] = useState(false);
  const [dietError,   setDietError]   = useState(null);
  const [openMeal,    setOpenMeal]    = useState(null);

  // Exercises
  const [exercises,  setExercises]  = useState([]);
  const [exFilter,   setExFilter]   = useState("all");
  const [exSearch,   setExSearch]   = useState("");
  const [loadingEx,  setLoadingEx]  = useState(true);

  // Chatbot
  const [messages,   setMessages]   = useState([
    { role: "ai", text: "👋 Hi! I'm your AI fitness coach. Ask me anything about workouts, nutrition, or fitness goals!" },
  ]);
  const [chatInput,  setChatInput]  = useState("");
  const [chatLoading,setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Behavior
  const [behavior,   setBehavior]   = useState(null);
  const [behLoading, setBehLoading] = useState(false);

  useEffect(() => { fetchStats(); fetchExercises(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const fetchStats = async () => {
    try { const r = await axios.get("/api/workout/stats"); setStats(r.data); }
    catch { setStats({ total_reps: 0, avg_score: 0, total_workouts: 0 }); }
    finally { setLoadingSt(false); }
  };

  const fetchExercises = async () => {
    try { const r = await axios.get("/api/recommendations"); setExercises(r.data || []); }
    catch { setExercises([]); }
    finally { setLoadingEx(false); }
  };

  const generateDiet = async () => {
    setDietLoading(true); setDietError(null); setDietResult(null);
    try {
      const payload = {
        ...dietForm,
        allergies: dietForm.allergies ? dietForm.allergies.split(",").map(s => s.trim()) : [],
      };
      const r = await axios.post("/api/diet", payload);
      setDietResult(r.data);
      setOpenMeal("breakfast");
    } catch (e) {
      setDietError(e.response?.data?.error || e.message || "Failed to generate diet plan");
    } finally { setDietLoading(false); }
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput(""); setMessages(m => [...m, { role: "user", text: msg }]);
    setChatLoading(true);
    try {
      const r = await axios.post("/api/chat", { message: msg });
      setMessages(m => [...m, { role: "ai", text: r.data.response || r.data.reply || "Got it!" }]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: "⚠️ Could not reach the AI service right now. Try again." }]);
    } finally { setChatLoading(false); }
  };

  const checkBehavior = async () => {
    setBehLoading(true);
    try { const r = await axios.get("/api/behavior?days_missed=2&consistency=60"); setBehavior(r.data); }
    catch { setBehavior({ prediction: "Unable to analyze — backend unreachable." }); }
    finally { setBehLoading(false); }
  };

  // ─── Filtered exercises ──────────────────────────────────────────────────
  const filteredEx = exercises.filter(ex => {
    const matchCat  = exFilter === "all" || ex.category === exFilter || ex.domain === exFilter;
    const matchSrch = !exSearch || ex.name?.toLowerCase().includes(exSearch.toLowerCase());
    return matchCat && matchSrch;
  });

  // ─── Chart data ───────────────────────────────────────────────────────────
  const macros = dietResult?.macros;
  const doughnutData = macros ? {
    labels: ["Protein", "Carbs", "Fats"],
    datasets: [{
      data: [macros.protein_pct, macros.carbs_pct, macros.fats_pct],
      backgroundColor: [C.primary, C.blue, C.secondary],
      borderWidth: 2, borderColor: C.surface,
    }],
  } : null;

  const progressData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{
      label: "Workout Sessions",
      data: [3, 4, 3, 5],
      borderColor: C.primary, backgroundColor: C.primary + "22",
      tension: 0.4, fill: true, pointBackgroundColor: C.primary,
    }],
  };

  // ─── Sidebar ──────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <div style={{
      width: sideOpen ? 220 : 64, minHeight: "100vh", background: "#0D0D14",
      borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column",
      transition: "width 0.25s", flexShrink: 0, position: "sticky", top: 0, alignSelf: "flex-start",
    }}>
      <div style={{ padding: "1.2rem 1rem", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, background: C.primary, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>⚡</div>
        {sideOpen && <span style={{ fontWeight: 800, fontSize: "1.1rem", color: C.text, letterSpacing: -0.5 }}>FitAI</span>}
      </div>
      <nav style={{ flex: 1, padding: "0.75rem 0.5rem", display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV.map(n => {
          const active = activeTab === n.id;
          return (
            <button key={n.id} onClick={() => setActiveTab(n.id)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "0.65rem 0.75rem",
              borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left",
              background: active ? C.primary + "18" : "transparent",
              color: active ? C.primary : C.textSec,
              fontWeight: active ? 600 : 400, fontSize: "0.9rem",
              transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
              {sideOpen && <span>{n.label}</span>}
              {active && sideOpen && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: C.primary }} />}
            </button>
          );
        })}
      </nav>
      <button onClick={() => setSideOpen(o => !o)} style={{
        margin: "0.75rem", padding: "0.5rem", background: C.surfaceLight,
        border: `1px solid ${C.border}`, borderRadius: 8, color: C.textSec,
        cursor: "pointer", fontSize: "0.75rem",
      }}>
        {sideOpen ? "◀ Collapse" : "▶"}
      </button>
    </div>
  );

  // ─── Stat card ────────────────────────────────────────────────────────────
  const StatCard = ({ icon, label, value, color }) => (
    <div style={{ ...card, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "1.4rem" }}>{icon}</span>
        <span style={{ fontSize: "0.7rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
      </div>
      <div style={{ fontSize: "2rem", fontWeight: 800, color: color || C.text }}>{loadingSt ? "—" : value}</div>
    </div>
  );

  // ─── Dashboard tab ────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}>Welcome back! 👋</h2>
        <p style={{ color: C.textSec, fontSize: "0.9rem" }}>Here's your fitness overview for today.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        <StatCard icon="🏋️" label="Total Reps"    value={stats?.total_reps ?? 0}                  color={C.primary} />
        <StatCard icon="⭐" label="Avg Score"      value={stats ? `${stats.avg_score?.toFixed(1)}` : "0"} color={C.amber} />
        <StatCard icon="🔥" label="Workouts Done"  value={stats?.total_workouts ?? 4}               color={C.secondary} />
        <StatCard icon="📅" label="Day Streak"     value="7 days"                                   color={C.purple} />
      </div>

      <div style={{ ...card }}>
        <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>📈 Weekly Progress</h3>
        <Line data={progressData} options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: C.textSec }, grid: { color: C.border } },
            y: { ticks: { color: C.textSec }, grid: { color: C.border } },
          },
        }} />
      </div>

      <div style={{ ...card }}>
        <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>⚡ Quick Actions</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {[
            { label: "🥗 Plan My Diet",     tab: "diet",      color: C.primary },
            { label: "💪 Browse Exercises",  tab: "exercises", color: C.blue },
            { label: "🤖 Ask AI Coach",      tab: "chatbot",   color: C.purple },
            { label: "📊 View Progress",     tab: "behavior",  color: C.amber },
          ].map(a => (
            <button key={a.tab} onClick={() => setActiveTab(a.tab)} style={btn(a.color)}>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── Diet form field helpers ───────────────────────────────────────────────
  const DF = (field, value) => setDietForm(f => ({ ...f, [field]: value }));

  const RadioGroup = ({ field, options }) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {options.map(o => {
        const active = dietForm[field] === o.value;
        return (
          <button key={o.value} onClick={() => DF(field, o.value)} style={{
            padding: "0.45rem 1rem", borderRadius: 8, border: `1.5px solid ${active ? o.color || C.primary : C.border}`,
            background: active ? (o.color || C.primary) + "18" : C.surfaceLight,
            color: active ? (o.color || C.primary) : C.textSec,
            fontWeight: active ? 700 : 400, fontSize: "0.85rem", cursor: "pointer", transition: "all 0.15s",
          }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );

  // ─── Macro bar ────────────────────────────────────────────────────────────
  const MacroBar = ({ label, grams, pct, color }) => (
    <div style={{ marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ color: C.textSec, fontSize: "0.85rem" }}>{label}</span>
        <span style={{ fontWeight: 700, color }}>{grams}g <span style={{ color: C.textMuted, fontWeight: 400 }}>({pct}%)</span></span>
      </div>
      <div style={{ height: 8, background: C.surfaceLight, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width 0.8s" }} />
      </div>
    </div>
  );

  // ─── Meal card ────────────────────────────────────────────────────────────
  const MealCard = ({ mealKey, foods }) => {
    const meta    = MEAL_META[mealKey];
    const isOpen  = openMeal === mealKey;
    const primary = foods[0];
    const alts    = foods.slice(1);
    if (!primary) return null;
    return (
      <div style={{ ...card, marginBottom: "0.75rem", transition: "all 0.2s" }}>
        <div
          onClick={() => setOpenMeal(isOpen ? null : mealKey)}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}
        >
          <div style={{
            width: 44, height: 44, background: C.primary + "18", borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0,
          }}>{meta.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{meta.label}</div>
            <div style={{ color: C.textSec, fontSize: "0.8rem" }}>{meta.time}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: C.primary, fontWeight: 700, fontSize: "0.9rem" }}>{primary.calories} kcal</div>
            <div style={{ color: C.textMuted, fontSize: "0.75rem" }}>P:{primary.protein}g C:{primary.carbs}g F:{primary.fats}g</div>
          </div>
          <div style={{ color: C.textMuted, fontSize: "1rem", marginLeft: 4 }}>{isOpen ? "▲" : "▼"}</div>
        </div>

        {isOpen && (
          <div style={{ marginTop: "1rem", borderTop: `1px solid ${C.border}`, paddingTop: "1rem" }}>
            <FoodItem food={primary} badge="Best Pick" badgeColor={C.primary} />
            {alts.length > 0 && (
              <>
                <div style={{ color: C.textMuted, fontSize: "0.75rem", margin: "0.75rem 0 0.5rem", textTransform: "uppercase", letterSpacing: 1 }}>
                  Alternatives
                </div>
                {alts.map((f, i) => <FoodItem key={i} food={f} badge={`Alt ${i + 1}`} badgeColor={C.blue} />)}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const FoodItem = ({ food, badge, badgeColor }) => (
    <div style={{ background: C.surfaceLight, borderRadius: 10, padding: "0.9rem", marginBottom: "0.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div style={{ fontWeight: 600, fontSize: "0.9rem", flex: 1, paddingRight: 8 }}>{food.name}</div>
        <span style={{
          background: badgeColor + "22", color: badgeColor,
          fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999, flexShrink: 0,
        }}>{badge}</span>
      </div>
      <div style={{ color: C.textSec, fontSize: "0.8rem", marginBottom: 8 }}>{food.description}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {[
          { label: `🔥 ${food.calories} kcal`, color: C.secondary },
          { label: `🥩 ${food.protein}g protein`, color: C.primary },
          { label: `🌾 ${food.carbs}g carbs`,   color: C.blue },
          { label: `🫙 ${food.fats}g fats`,     color: C.amber },
          { label: `⏱ ${food.prep_time}`,       color: C.textSec },
          { label: `🍽 ${food.portion}`,        color: C.textSec },
        ].map((t, i) => (
          <span key={i} style={{
            background: t.color + "15", color: t.color,
            fontSize: "0.72rem", padding: "2px 8px", borderRadius: 999, fontWeight: 500,
          }}>{t.label}</span>
        ))}
      </div>
    </div>
  );

  // ─── Diet tab ─────────────────────────────────────────────────────────────
  const renderDiet = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}>🥗 Smart Diet Planner</h2>
        <p style={{ color: C.textSec, fontSize: "0.9rem" }}>
          Powered by Mifflin-St Jeor formula · Indian food database · Personalised macros
        </p>
      </div>

      {/* ── Form ── */}
      <div style={{ ...card }}>
        <h3 style={{ fontWeight: 700, marginBottom: "1.25rem", color: C.primary }}>Your Details</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <label style={{ color: C.textSec, fontSize: "0.8rem", display: "block", marginBottom: 6 }}>Age</label>
            <input type="number" value={dietForm.age} min={10} max={90}
              onChange={e => DF("age", +e.target.value)} style={inp} />
          </div>
          <div>
            <label style={{ color: C.textSec, fontSize: "0.8rem", display: "block", marginBottom: 6 }}>Height (cm)</label>
            <input type="number" value={dietForm.height} min={140} max={220}
              onChange={e => DF("height", +e.target.value)} style={inp} />
          </div>
          <div>
            <label style={{ color: C.textSec, fontSize: "0.8rem", display: "block", marginBottom: 6 }}>Weight (kg)</label>
            <input type="number" value={dietForm.weight} min={30} max={200}
              onChange={e => DF("weight", +e.target.value)} style={inp} />
          </div>
          <div>
            <label style={{ color: C.textSec, fontSize: "0.8rem", display: "block", marginBottom: 6 }}>Gender</label>
            <RadioGroup field="gender" options={[{ value: "male", label: "♂ Male", color: C.blue }, { value: "female", label: "♀ Female", color: C.purple }]} />
          </div>
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ color: C.textSec, fontSize: "0.8rem", display: "block", marginBottom: 8 }}>Fitness Goal</label>
          <RadioGroup field="goal" options={[
            { value: "fat_loss",     label: "🔥 Fat Loss",     color: C.secondary },
            { value: "muscle_gain",  label: "💪 Muscle Gain",  color: C.primary },
            { value: "maintenance",  label: "⚖️ Maintenance",  color: C.amber },
          ]} />
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ color: C.textSec, fontSize: "0.8rem", display: "block", marginBottom: 8 }}>Activity Level</label>
          <RadioGroup field="activity" options={[
            { value: "sedentary", label: "🪑 Sedentary", color: C.textSec },
            { value: "moderate",  label: "🚶 Moderate",  color: C.amber },
            { value: "active",    label: "🏃 Active",    color: C.green || "#22c55e" },
          ]} />
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ color: C.textSec, fontSize: "0.8rem", display: "block", marginBottom: 8 }}>Diet Type</label>
          <RadioGroup field="diet_type" options={[
            { value: "vegan",           label: "🌱 Vegan",         color: "#22c55e" },
            { value: "vegetarian",      label: "🥦 Vegetarian",    color: C.primary },
            { value: "non_vegetarian",  label: "🍗 Non-Veg",       color: C.secondary },
          ]} />
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ color: C.textSec, fontSize: "0.8rem", display: "block", marginBottom: 8 }}>Budget</label>
          <RadioGroup field="budget" options={[
            { value: "low",    label: "💰 Budget-Friendly", color: "#22c55e" },
            { value: "medium", label: "💰💰 Medium",         color: C.amber },
            { value: "high",   label: "💰💰💰 Premium",      color: C.purple },
          ]} />
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ color: C.textSec, fontSize: "0.8rem", display: "block", marginBottom: 6 }}>Allergies (optional, comma-separated)</label>
          <input type="text" value={dietForm.allergies} placeholder="e.g. peanuts, gluten"
            onChange={e => DF("allergies", e.target.value)} style={inp} />
        </div>

        <button onClick={generateDiet} disabled={dietLoading} style={{
          ...btn(C.primary), width: "100%", padding: "0.8rem",
          fontSize: "1rem", opacity: dietLoading ? 0.7 : 1,
        }}>
          {dietLoading ? "⏳ Generating Your Plan..." : "⚡ Generate My Diet Plan"}
        </button>

        {dietError && (
          <div style={{ marginTop: "1rem", background: C.red + "18", border: `1px solid ${C.red}`, borderRadius: 8, padding: "0.75rem", color: C.red, fontSize: "0.85rem" }}>
            ⚠️ {dietError}
          </div>
        )}
      </div>

      {/* ── Results ── */}
      {dietResult && (() => {
        const { user_summary, calories, macros, meal_plan, tips, warnings, supplements, workout_nutrition } = dietResult;
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Summary bar */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem" }}>
              {[
                { icon: "🎯", label: "Target Calories", val: `${calories.target} kcal`, color: C.primary },
                { icon: "📉", label: "BMR",             val: `${calories.bmr} kcal`,   color: C.blue },
                { icon: "⚡",  label: "TDEE",            val: `${calories.tdee} kcal`,  color: C.amber },
                { icon: "📊", label: "BMI",              val: `${user_summary.bmi?.value} (${user_summary.bmi?.category})`, color: C.purple },
              ].map(s => (
                <div key={s.label} style={{ ...card, textAlign: "center" }}>
                  <div style={{ fontSize: "1.4rem" }}>{s.icon}</div>
                  <div style={{ color: s.color, fontWeight: 800, fontSize: "1.1rem", margin: "4px 0" }}>{s.val}</div>
                  <div style={{ color: C.textMuted, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Macros */}
            <div style={{ ...card }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>
                🧮 Macro Breakdown — {GOAL_LABELS[user_summary.goal] || user_summary.goal}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "center" }}>
                <div style={{ width: 180, height: 180, flexShrink: 0 }}>
                  <Doughnut data={doughnutData} options={{
                    responsive: true, maintainAspectRatio: true, cutout: "72%",
                    plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } } },
                  }} />
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <MacroBar label="🥩 Protein" grams={macros.protein} pct={macros.protein_pct} color={C.primary} />
                  <MacroBar label="🌾 Carbohydrates" grams={macros.carbs} pct={macros.carbs_pct} color={C.blue} />
                  <MacroBar label="🫙 Fats" grams={macros.fats} pct={macros.fats_pct} color={C.secondary} />
                  <div style={{ marginTop: "0.75rem", padding: "0.65rem", background: C.surfaceLight, borderRadius: 8, fontSize: "0.82rem", color: C.textSec }}>
                    Diet: <strong style={{ color: C.text }}>{user_summary.diet_type?.replace("_", "-")}</strong> ·
                    Budget: <strong style={{ color: C.text }}>{user_summary.budget}</strong> ·
                    {calories.deficit_surplus > 0 ? ` +${calories.deficit_surplus} kcal surplus` : ` ${calories.deficit_surplus} kcal deficit`}
                  </div>
                </div>
              </div>
            </div>

            {/* Meal Plan */}
            <div style={{ ...card }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>🍽️ Your 5-Meal Daily Plan</h3>
              <p style={{ color: C.textSec, fontSize: "0.82rem", marginBottom: "1rem" }}>
                Click each meal to see options and alternatives tailored to your diet type and budget.
              </p>
              {Object.entries(meal_plan).map(([key, foods]) => (
                <MealCard key={key} mealKey={key} foods={foods} />
              ))}
            </div>

            {/* Workout Nutrition */}
            {workout_nutrition && Object.keys(workout_nutrition).length > 0 && (
              <div style={{ ...card }}>
                <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>🏋️ Workout Nutrition Timing</h3>
                {[
                  { key: "pre_workout",  icon: "⚡", label: "Pre-Workout",  color: C.amber },
                  { key: "post_workout", icon: "🔄", label: "Post-Workout", color: C.primary },
                  { key: "hydration",    icon: "💧", label: "Hydration",    color: C.blue },
                ].map(w => workout_nutrition[w.key] && (
                  <div key={w.key} style={{ background: C.surfaceLight, borderRadius: 10, padding: "0.85rem", marginBottom: "0.6rem", display: "flex", gap: "0.75rem" }}>
                    <span style={{ fontSize: "1.2rem" }}>{w.icon}</span>
                    <div>
                      <div style={{ color: w.color, fontWeight: 600, fontSize: "0.82rem", marginBottom: 3 }}>{w.label}</div>
                      <div style={{ color: C.textSec, fontSize: "0.85rem" }}>{workout_nutrition[w.key]}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Supplements */}
            {supplements?.length > 0 && (
              <div style={{ ...card }}>
                <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>💊 Recommended Supplements</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
                  {supplements.map((s, i) => (
                    <div key={i} style={{ background: C.surfaceLight, borderRadius: 10, padding: "0.85rem" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: C.purple, marginBottom: 4 }}>{s.name}</div>
                      <div style={{ fontSize: "0.78rem", color: C.textSec, marginBottom: 3 }}>Dose: {s.dose}</div>
                      <div style={{ fontSize: "0.78rem", color: C.textSec, marginBottom: 3 }}>Timing: {s.timing}</div>
                      <div style={{ fontSize: "0.78rem", color: C.textMuted }}>{s.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips & Warnings */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              {tips?.length > 0 && (
                <div style={{ ...card }}>
                  <h3 style={{ fontWeight: 700, marginBottom: "1rem", color: C.primary }}>💡 Pro Tips</h3>
                  {tips.map((t, i) => (
                    <div key={i} style={{
                      background: C.primary + "0D", border: `1px solid ${C.primary}22`,
                      borderRadius: 8, padding: "0.65rem 0.85rem", marginBottom: "0.5rem",
                      fontSize: "0.83rem", color: C.textSec, lineHeight: 1.5,
                    }}>
                      <span style={{ marginRight: 6 }}>✅</span>{t}
                    </div>
                  ))}
                </div>
              )}
              {warnings?.length > 0 && (
                <div style={{ ...card }}>
                  <h3 style={{ fontWeight: 700, marginBottom: "1rem", color: C.red }}>⚠️ Warnings</h3>
                  {warnings.map((w, i) => (
                    <div key={i} style={{
                      background: C.red + "0D", border: `1px solid ${C.red}22`,
                      borderRadius: 8, padding: "0.65rem 0.85rem", marginBottom: "0.5rem",
                      fontSize: "0.83rem", color: C.textSec, lineHeight: 1.5,
                    }}>
                      {w}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        );
      })()}
    </div>
  );

  // ─── Exercises tab ────────────────────────────────────────────────────────
  const renderExercises = () => {
    const cats = ["all", "freehand", "gym", "calisthenics", "martial_arts", "yoga", "cardio", "rehab"];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}>💪 Exercise Library</h2>
          <p style={{ color: C.textSec, fontSize: "0.9rem" }}>58+ exercises across 7 training domains</p>
        </div>

        <input
          type="text" placeholder="🔍 Search exercises..."
          value={exSearch} onChange={e => setExSearch(e.target.value)}
          style={{ ...inp, padding: "0.7rem 1rem" }}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setExFilter(c)} style={{
              padding: "0.4rem 0.9rem", borderRadius: 999, border: `1.5px solid ${exFilter === c ? C.primary : C.border}`,
              background: exFilter === c ? C.primary + "18" : C.surfaceLight,
              color: exFilter === c ? C.primary : C.textSec,
              fontWeight: exFilter === c ? 700 : 400, fontSize: "0.82rem", cursor: "pointer",
            }}>
              {c === "all" ? "All" : `${CAT_ICONS[c] || "🏃"} ${c.charAt(0).toUpperCase() + c.slice(1).replace("_", " ")}`}
            </button>
          ))}
        </div>

        {loadingEx ? (
          <div style={{ color: C.textSec, padding: "2rem", textAlign: "center" }}>Loading exercises...</div>
        ) : filteredEx.length === 0 ? (
          <div style={{ color: C.textSec, padding: "2rem", textAlign: "center" }}>No exercises found</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
            {filteredEx.map((ex, i) => (
              <div key={ex.id || i} style={{ ...card, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "1.3rem" }}>{CAT_ICONS[ex.category] || CAT_ICONS[ex.domain] || "🏃"}</span>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                    background: (DIFF_COLORS[ex.difficulty] || C.textSec) + "22",
                    color: DIFF_COLORS[ex.difficulty] || C.textSec,
                  }}>{ex.difficulty || "?"}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{ex.name}</div>
                <div style={{ color: C.textSec, fontSize: "0.78rem", lineHeight: 1.4 }}>{ex.description}</div>
                {ex.targetMuscles && (
                  <div style={{ fontSize: "0.72rem", color: C.textMuted }}>
                    🎯 {Array.isArray(ex.targetMuscles) ? ex.targetMuscles.join(", ") : ex.targetMuscles}
                  </div>
                )}
                {ex.caloriesPerRep && (
                  <div style={{ fontSize: "0.72rem", color: C.secondary }}>🔥 {ex.caloriesPerRep} cal/rep</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ─── Chatbot tab ──────────────────────────────────────────────────────────
  const renderChatbot = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", height: "80vh" }}>
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}>🤖 AI Fitness Coach</h2>
        <p style={{ color: C.textSec, fontSize: "0.9rem" }}>Ask anything about workouts, nutrition, or motivation</p>
      </div>

      <div style={{
        ...card, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem",
        minHeight: 0,
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "75%", padding: "0.75rem 1rem", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              background: m.role === "user" ? C.primary : C.surfaceLight,
              color: m.role === "user" ? "#000" : C.text,
              fontSize: "0.88rem", lineHeight: 1.55,
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {chatLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: C.surfaceLight, padding: "0.75rem 1rem", borderRadius: "14px 14px 14px 4px", color: C.textSec, fontSize: "0.88rem" }}>
              ⏳ Thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <input
          value={chatInput} onChange={e => setChatInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendChat()}
          placeholder="Ask your AI coach…"
          style={{ ...inp, flex: 1, padding: "0.8rem 1rem" }}
        />
        <button onClick={sendChat} disabled={chatLoading} style={{ ...btn(C.primary), padding: "0.8rem 1.4rem" }}>
          Send ➤
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {["Best exercises for fat loss?", "How much protein do I need?", "How to stay motivated?", "Suggest a workout plan"].map(q => (
          <button key={q} onClick={() => { setChatInput(q); }}
            style={{ ...btn(C.purple, true), fontSize: "0.78rem", padding: "0.35rem 0.75rem" }}>
            {q}
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Progress / Behavior tab ───────────────────────────────────────────────
  const renderBehavior = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}>📊 Progress & Behavior Analysis</h2>
        <p style={{ color: C.textSec, fontSize: "0.9rem" }}>Track your consistency and get personalized insights</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
        <div style={{ ...card }}>
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>📈 Workout History</h3>
          <Line data={progressData} options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: C.textSec }, grid: { color: C.border } },
              y: { ticks: { color: C.textSec }, grid: { color: C.border } },
            },
          }} />
        </div>

        <div style={{ ...card }}>
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>🧠 Consistency Check</h3>
          <p style={{ color: C.textSec, fontSize: "0.85rem", marginBottom: "1rem", lineHeight: 1.5 }}>
            Get an AI-powered analysis of your workout consistency and dropout risk.
          </p>
          <button onClick={checkBehavior} disabled={behLoading} style={{ ...btn(C.amber), width: "100%", marginBottom: "1rem" }}>
            {behLoading ? "⏳ Analyzing..." : "🔍 Analyze My Consistency"}
          </button>
          {behavior && (
            <div style={{ background: C.amber + "15", border: `1px solid ${C.amber}33`, borderRadius: 10, padding: "1rem" }}>
              <div style={{ fontWeight: 700, marginBottom: 6, color: C.amber }}>Analysis Result:</div>
              <div style={{ color: C.textSec, fontSize: "0.85rem", lineHeight: 1.55 }}>
                {typeof behavior === "string" ? behavior : behavior.prediction || JSON.stringify(behavior)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ ...card }}>
        <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>🏆 Streak & Milestones</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem" }}>
          {[
            { icon: "🔥", label: "Current Streak",  value: "7 days",     color: C.secondary },
            { icon: "💪", label: "Longest Streak",  value: "14 days",    color: C.primary },
            { icon: "📅", label: "This Month",      value: "18 sessions",color: C.blue },
            { icon: "⭐", label: "Personal Best",   value: "850 reps",   color: C.amber },
          ].map(m => (
            <div key={m.label} style={{ background: C.surfaceLight, borderRadius: 10, padding: "1rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem" }}>{m.icon}</div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", color: m.color, margin: "4px 0" }}>{m.value}</div>
              <div style={{ fontSize: "0.72rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  const sections = { dashboard: renderDashboard, diet: renderDiet, exercises: renderExercises, chatbot: renderChatbot, behavior: renderBehavior };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2rem 1.75rem", overflowY: "auto", minWidth: 0 }}>
        <div style={{ maxWidth: 900 }}>
          {(sections[activeTab] || renderDashboard)()}
        </div>
      </main>
    </div>
  );
}
