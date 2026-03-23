import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { COLORS, FONTS, SIZES, RADIUS, SPACING } from "@/constants/theme";
import {
  EXERCISES,
  ExerciseCategory,
  getCategoryColor,
  getCategoryIcon,
} from "@/constants/exercises";
import { generateWorkout } from "@/lib/api";
import { useWorkoutStore, WorkoutPlan } from "@/store/useWorkoutStore";

type Goal = "muscle_gain" | "fat_loss" | "flexibility" | "mma" | "general";
type EquipmentLevel = "none" | "minimal" | "full_gym";
type Level = "beginner" | "intermediate" | "advanced";

const GOALS: { id: Goal; label: string; icon: string; color: string; desc: string }[] = [
  { id: "muscle_gain", label: "Build Muscle", icon: "barbell", color: COLORS.secondary, desc: "Compound lifts & volume" },
  { id: "fat_loss", label: "Fat Loss", icon: "flame", color: COLORS.amber, desc: "HIIT & metabolic" },
  { id: "flexibility", label: "Flexibility", icon: "leaf", color: "#10B981", desc: "Yoga & mobility" },
  { id: "mma", label: "MMA / Fighting", icon: "fitness", color: "#EF4444", desc: "Combat conditioning" },
  { id: "general", label: "General Fitness", icon: "trophy", color: COLORS.primary, desc: "Balanced training" },
];

const EQUIPMENT_OPTIONS: { id: EquipmentLevel; label: string; icon: string; desc: string }[] = [
  { id: "none", label: "No Equipment", icon: "body-outline", desc: "Bodyweight only" },
  { id: "minimal", label: "Minimal", icon: "barbell-outline", desc: "Dumbbells & bands" },
  { id: "full_gym", label: "Full Gym", icon: "home-outline", desc: "All equipment" },
];

const LEVEL_OPTIONS: { id: Level; label: string; color: string }[] = [
  { id: "beginner", label: "Beginner", color: COLORS.primary },
  { id: "intermediate", label: "Intermediate", color: COLORS.amber },
  { id: "advanced", label: "Advanced", color: COLORS.secondary },
];

const FEATURED: { id: string; label: string; category: ExerciseCategory }[] = [
  { id: "pushup_normal", label: "Push-up", category: "freehand" },
  { id: "squat_bodyweight", label: "Squat", category: "freehand" },
  { id: "pullup", label: "Pull-up", category: "calisthenics" },
  { id: "burpee", label: "Burpee", category: "cardio" },
  { id: "jab_cross", label: "Jab-Cross", category: "martial_arts" },
  { id: "downward_dog", label: "Down Dog", category: "yoga" },
];

interface GeneratedWorkout {
  name: string;
  description: string;
  exercises: { id: string; name: string; sets: number; reps: number; category: string }[];
}

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { setCurrentPlan } = useWorkoutStore();

  const [goal, setGoal] = useState<Goal>("general");
  const [equipment, setEquipment] = useState<EquipmentLevel>("none");
  const [level, setLevel] = useState<Level>("beginner");
  const [loading, setLoading] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<GeneratedWorkout | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setGeneratedWorkout(null);
    try {
      const result = await generateWorkout({ goal, equipment, level, duration_minutes: 30 });
      setGeneratedWorkout(result);
    } catch {
      const fallback = generateLocalWorkout(goal, equipment, level);
      setGeneratedWorkout(fallback);
    } finally {
      setLoading(false);
    }
  }, [goal, equipment, level]);

  const handleStartSession = useCallback((workout: GeneratedWorkout) => {
    const plan: WorkoutPlan = {
      id: `plan_${Date.now()}`,
      name: workout.name,
      description: workout.description,
      goal,
      level,
      equipment,
      duration_minutes: 30,
      exercises: workout.exercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        category: ex.category,
        restSeconds: 45,
      })),
      createdAt: Date.now(),
    };
    setCurrentPlan(plan);
    router.push("/workout/session");
  }, [goal, level, equipment, setCurrentPlan]);

  const generateLocalWorkout = (
    g: Goal,
    eq: EquipmentLevel,
    lv: Level
  ): GeneratedWorkout => {
    const domainMap: Record<Goal, ExerciseCategory[]> = {
      muscle_gain: ["gym", "freehand", "calisthenics"],
      fat_loss: ["cardio", "freehand"],
      flexibility: ["yoga", "rehab"],
      mma: ["martial_arts", "cardio"],
      general: ["freehand", "gym", "cardio", "yoga"],
    };

    const equipMap: Record<EquipmentLevel, string[]> = {
      none: ["none", "mat"],
      minimal: ["none", "mat", "dumbbell", "band"],
      full_gym: ["none", "mat", "dumbbell", "barbell", "cable", "machine", "kettlebell", "pullup_bar", "parallel_bars", "band", "rope"],
    };

    const domains = domainMap[g];
    const allowedEquip = equipMap[eq];

    const pool = EXERCISES.filter(
      e =>
        domains.includes(e.category) &&
        e.difficulty === lv &&
        e.equipment.some(eq2 => allowedEquip.includes(eq2))
    );

    const fallbackPool = EXERCISES.filter(e => domains.includes(e.category) && e.difficulty === lv);
    const usePool = pool.length >= 5 ? pool : fallbackPool;

    const shuffled = [...usePool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(6, usePool.length));

    const goalNames: Record<Goal, string> = {
      muscle_gain: "Muscle Builder",
      fat_loss: "Fat Burner",
      flexibility: "Flexibility Flow",
      mma: "Combat Conditioning",
      general: "Full Body Blast",
    };

    return {
      name: `${goalNames[g]} — ${lv.charAt(0).toUpperCase() + lv.slice(1)}`,
      description: `A personalized ${lv} workout tailored for ${g.replace("_", " ")} goals.`,
      exercises: selected.map(e => ({
        id: e.id,
        name: e.name,
        sets: g === "muscle_gain" ? 4 : 3,
        reps: g === "fat_loss" ? 15 : g === "flexibility" ? 30 : 12,
        category: e.category,
      })),
    };
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
          <View>
            <Text style={styles.title}>Workout</Text>
            <Text style={styles.subtitle}>Train smart, not hard</Text>
          </View>
          <TouchableOpacity
            style={styles.historyHeaderBtn}
            onPress={() => router.push("/workout/history")}
          >
            <Ionicons name="time-outline" size={20} color={COLORS.primary} />
            <Text style={styles.historyHeaderBtnText}>History</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* AI Trainer Banner */}
        <Animated.View entering={FadeInDown.delay(80).springify()}>
          <View style={styles.aiBanner}>
            <View style={styles.aiLeft}>
              <View style={styles.aiIconBg}>
                <Ionicons name="camera" size={24} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.aiBannerTitle}>AI Live Trainer</Text>
                <Text style={styles.aiBannerSub}>Camera-powered rep counting</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.aiBtn}
              onPress={() => router.push({ pathname: "/exercise/detail", params: { id: "pushup_normal", category: "freehand" } })}
            >
              <Ionicons name="play" size={16} color={COLORS.background} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Smart Generator Toggle */}
        <Animated.View entering={FadeInDown.delay(160).springify()}>
          <TouchableOpacity
            style={[styles.generatorToggle, showGenerator && { borderColor: COLORS.primary + "50" }]}
            onPress={() => {
              setShowGenerator(v => !v);
              setGeneratedWorkout(null);
            }}
          >
            <View style={styles.genToggleLeft}>
              <Ionicons name="flash" size={22} color={COLORS.primary} />
              <View>
                <Text style={styles.genToggleTitle}>Smart Workout Generator</Text>
                <Text style={styles.genToggleSub}>AI builds your plan instantly</Text>
              </View>
            </View>
            <Ionicons
              name={showGenerator ? "chevron-up" : "chevron-down"}
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Generator Panel */}
        {showGenerator && (
          <Animated.View entering={FadeInDown.springify()} style={styles.generatorPanel}>
            <Text style={styles.genSectionLabel}>Your Goal</Text>
            <View style={styles.goalGrid}>
              {GOALS.map(g => (
                <TouchableOpacity
                  key={g.id}
                  style={[styles.goalCard, goal === g.id && { borderColor: g.color, backgroundColor: g.color + "15" }]}
                  onPress={() => setGoal(g.id)}
                >
                  <Ionicons name={g.icon as any} size={20} color={g.color} />
                  <Text style={[styles.goalLabel, goal === g.id && { color: g.color }]}>{g.label}</Text>
                  <Text style={styles.goalDesc}>{g.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.genSectionLabel}>Equipment Available</Text>
            <View style={styles.optionRow}>
              {EQUIPMENT_OPTIONS.map(o => (
                <TouchableOpacity
                  key={o.id}
                  style={[styles.optionBtn, equipment === o.id && { borderColor: COLORS.primary, backgroundColor: COLORS.primaryDim }]}
                  onPress={() => setEquipment(o.id)}
                >
                  <Ionicons name={o.icon as any} size={18} color={equipment === o.id ? COLORS.primary : COLORS.textSecondary} />
                  <Text style={[styles.optionLabel, equipment === o.id && { color: COLORS.primary }]}>{o.label}</Text>
                  <Text style={styles.optionDesc}>{o.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.genSectionLabel}>Fitness Level</Text>
            <View style={styles.levelRow}>
              {LEVEL_OPTIONS.map(l => (
                <TouchableOpacity
                  key={l.id}
                  style={[styles.levelBtn, level === l.id && { borderColor: l.color, backgroundColor: l.color + "20" }]}
                  onPress={() => setLevel(l.id)}
                >
                  <Text style={[styles.levelLabel, level === l.id && { color: l.color }]}>{l.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.generateBtn, loading && { opacity: 0.7 }]}
              onPress={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.background} size="small" />
              ) : (
                <Ionicons name="flash" size={18} color={COLORS.background} />
              )}
              <Text style={styles.generateBtnText}>
                {loading ? "Generating..." : "Generate My Workout"}
              </Text>
            </TouchableOpacity>

            {/* Generated Result */}
            {generatedWorkout && (
              <Animated.View entering={FadeInUp.springify()} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View style={[styles.resultIconBg, { backgroundColor: COLORS.primary + "20" }]}>
                    <Ionicons name="flash" size={20} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resultName}>{generatedWorkout.name}</Text>
                    <Text style={styles.resultDesc}>{generatedWorkout.description}</Text>
                  </View>
                </View>
                {generatedWorkout.exercises.map((ex, i) => {
                  const color = getCategoryColor(ex.category as ExerciseCategory);
                  return (
                    <TouchableOpacity
                      key={ex.id}
                      style={[styles.genExRow, { borderColor: color + "20" }]}
                      onPress={() => router.push({ pathname: "/exercise/detail", params: { id: ex.id, category: ex.category } })}
                    >
                      <View style={[styles.genExNum, { backgroundColor: color + "20" }]}>
                        <Text style={[styles.genExNumText, { color }]}>{i + 1}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.genExName}>{ex.name}</Text>
                        <Text style={styles.genExSets}>{ex.sets} sets × {ex.reps} reps</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={color} />
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity
                  style={styles.startFullBtn}
                  onPress={() => handleStartSession(generatedWorkout)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="play" size={18} color={COLORS.background} />
                  <Text style={styles.startFullBtnText}>Start Full Workout</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* Featured Exercises */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
        </Animated.View>
        <View style={styles.featuredGrid}>
          {FEATURED.map((item, i) => {
            const color = getCategoryColor(item.category);
            const icon = getCategoryIcon(item.category);
            return (
              <Animated.View key={item.id} entering={FadeInDown.delay(i * 50 + 350).springify()} style={styles.featuredWrapper}>
                <TouchableOpacity
                  style={[styles.featuredCard, { borderColor: color + "30" }]}
                  onPress={() => router.push({ pathname: "/exercise/detail", params: { id: item.id, category: item.category } })}
                  activeOpacity={0.75}
                >
                  <View style={[styles.featuredIcon, { backgroundColor: color + "20" }]}>
                    <Ionicons name={icon as any} size={26} color={color} />
                  </View>
                  <Text style={styles.featuredName}>{item.label}</Text>
                  <View style={[styles.startBtn, { backgroundColor: color }]}>
                    <Ionicons name="play" size={12} color={COLORS.background} />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Browse Categories */}
        <Animated.View entering={FadeInDown.delay(600).springify()}>
          <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>Browse Categories</Text>
          {(["freehand", "gym", "calisthenics", "martial_arts", "yoga", "cardio", "rehab"] as ExerciseCategory[]).map((cat, i) => {
            const count = EXERCISES.filter(e => e.category === cat).length;
            const color = getCategoryColor(cat);
            const icon = getCategoryIcon(cat);
            const labels: Record<ExerciseCategory, string> = {
              freehand: "Bodyweight",
              gym: "Gym",
              calisthenics: "Calisthenics",
              martial_arts: "Martial Arts",
              yoga: "Yoga",
              cardio: "Cardio",
              rehab: "Rehab & Balance",
            };
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryRow, { borderColor: color + "30" }]}
                onPress={() => router.push({ pathname: "/exercise/[category]", params: { category: cat } })}
                activeOpacity={0.8}
              >
                <View style={[styles.catIcon, { backgroundColor: color + "20" }]}>
                  <Ionicons name={icon as any} size={22} color={color} />
                </View>
                <View style={styles.catInfo}>
                  <Text style={styles.catName}>{labels[cat]}</Text>
                  <Text style={styles.catCount}>{count} exercises</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={color} />
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        <View style={{ height: SPACING.xxxl + 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING.xl },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginBottom: SPACING.lg, marginTop: SPACING.md,
  },
  title: { fontFamily: FONTS.bold, fontSize: SIZES.xxxl, color: COLORS.text },
  subtitle: { fontFamily: FONTS.regular, fontSize: SIZES.md, color: COLORS.textSecondary, marginTop: 4 },
  historyHeaderBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: COLORS.primaryDim, paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2, borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: COLORS.primary + "30",
  },
  historyHeaderBtnText: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs, color: COLORS.primary },

  aiBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primaryDim,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
  },
  aiLeft: { flexDirection: "row", alignItems: "center", gap: SPACING.md, flex: 1 },
  aiIconBg: {
    width: 48, height: 48, borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary + "25",
    alignItems: "center", justifyContent: "center",
  },
  aiBannerTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text },
  aiBannerSub: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  aiBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary,
    alignItems: "center", justifyContent: "center",
    shadowColor: COLORS.primary, shadowOpacity: 0.5, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },

  generatorToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  genToggleLeft: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  genToggleTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text },
  genToggleSub: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },

  generatorPanel: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primary + "20",
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  genSectionLabel: { fontFamily: FONTS.bold, fontSize: SIZES.sm, color: COLORS.textSecondary, textTransform: "uppercase", letterSpacing: 0.8, marginTop: SPACING.sm },
  goalGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  goalCard: {
    width: "48%",
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  goalLabel: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.text },
  goalDesc: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textMuted },

  optionRow: { flexDirection: "row", gap: SPACING.sm },
  optionBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    gap: 4,
  },
  optionLabel: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs, color: COLORS.text, textAlign: "center" },
  optionDesc: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textMuted, textAlign: "center" },

  levelRow: { flexDirection: "row", gap: SPACING.sm },
  levelBtn: {
    flex: 1,
    padding: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    backgroundColor: COLORS.surfaceLight,
  },
  levelLabel: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.textSecondary },

  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    height: 52,
    marginTop: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  generateBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.background },

  resultCard: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  resultHeader: { flexDirection: "row", alignItems: "flex-start", gap: SPACING.md, marginBottom: SPACING.sm },
  resultIconBg: { width: 40, height: 40, borderRadius: RADIUS.md, alignItems: "center", justifyContent: "center" },
  resultName: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text },
  resultDesc: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
  genExRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    gap: SPACING.md,
  },
  genExNum: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  genExNumText: { fontFamily: FONTS.bold, fontSize: SIZES.sm },
  genExName: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.text },
  genExSets: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },

  startFullBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    height: 48,
    marginTop: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  startFullBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.background },

  sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text, marginBottom: SPACING.md },
  featuredGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm, marginBottom: SPACING.md },
  featuredWrapper: { width: "48.5%" },
  featuredCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  featuredIcon: {
    width: 48, height: 48, borderRadius: RADIUS.lg,
    alignItems: "center", justifyContent: "center",
  },
  featuredName: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.text },
  startBtn: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: "center", justifyContent: "center", alignSelf: "flex-end",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    gap: SPACING.md,
  },
  catIcon: {
    width: 48, height: 48, borderRadius: RADIUS.md,
    alignItems: "center", justifyContent: "center",
  },
  catInfo: { flex: 1 },
  catName: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.text },
  catCount: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
});
