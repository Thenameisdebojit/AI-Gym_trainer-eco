import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { fetchStats } from "@/lib/api";
import { COLORS, FONTS, SIZES, RADIUS, SPACING } from "@/constants/theme";
import {
  EXERCISES,
  ExerciseCategory,
  getCategoryColor,
  getCategoryIcon,
} from "@/constants/exercises";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const CATEGORY_ROWS: { id: ExerciseCategory; label: string }[] = [
  { id: "gym", label: "Gym" },
  { id: "freehand", label: "Bodyweight" },
  { id: "calisthenics", label: "Calisthenics" },
  { id: "martial_arts", label: "Martial Arts" },
  { id: "yoga", label: "Yoga" },
  { id: "cardio", label: "Cardio" },
  { id: "rehab", label: "Rehab" },
];

const QUICK_EXERCISES = [
  { id: "pushup_normal", name: "Push-up", category: "freehand" as ExerciseCategory },
  { id: "squat_bodyweight", name: "Squat", category: "freehand" as ExerciseCategory },
  { id: "pullup", name: "Pull-up", category: "calisthenics" as ExerciseCategory },
  { id: "burpee", name: "Burpee", category: "cardio" as ExerciseCategory },
];

function StreakBadge({ streak }: { streak: number }) {
  const glow = useSharedValue(0.3);
  useEffect(() => {
    glow.value = withRepeat(
      withSequence(withTiming(1, { duration: 1000 }), withTiming(0.3, { duration: 1000 })),
      -1,
      false
    );
  }, []);
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));
  return (
    <View style={styles.streakBadge}>
      <Animated.View style={[styles.streakGlow, glowStyle]} />
      <Ionicons name="flame" size={16} color="#F97316" />
      <Text style={styles.streakText}>{streak} day streak</Text>
    </View>
  );
}

function StatCard({ label, value, unit, icon, color, delay }: any) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={[styles.statCard, { borderColor: color + "30" }]}>
      <View style={[styles.statIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statUnit}>{unit}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

function QuickItem({ item, index }: { item: typeof QUICK_EXERCISES[0]; index: number }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const color = getCategoryColor(item.category);
  const icon = getCategoryIcon(item.category);
  return (
    <Animated.View entering={FadeInRight.delay(index * 80).springify()} style={animStyle}>
      <TouchableOpacity
        onPressIn={() => { scale.value = withSpring(0.96); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={() => router.push({ pathname: "/exercise/detail", params: { id: item.id, category: item.category } })}
        style={[styles.quickItem, { backgroundColor: color + "12", borderColor: color + "25" }]}
        activeOpacity={0.8}
      >
        <View style={[styles.quickIcon, { backgroundColor: color + "25" }]}>
          <Ionicons name={icon as any} size={22} color={color} />
        </View>
        <Text style={styles.quickName}>{item.name}</Text>
        <Ionicons name="chevron-forward" size={14} color={color} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { data: stats } = useQuery({ queryKey: ["/workout/stats"], queryFn: fetchStats, retry: false });
  const [streak, setStreak] = useState(0);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    loadStreak();
    updateStreak();
  }, []);

  const loadStreak = async () => {
    try {
      const s = await AsyncStorage.getItem("fitai_streak");
      if (s) setStreak(parseInt(s, 10));
    } catch {}
  };

  const updateStreak = async () => {
    try {
      const lastDate = await AsyncStorage.getItem("fitai_last_active");
      const today = new Date().toDateString();
      if (lastDate !== today) {
        await AsyncStorage.setItem("fitai_last_active", today);
        const currentStreak = await AsyncStorage.getItem("fitai_streak");
        const s = parseInt(currentStreak ?? "0", 10) + 1;
        await AsyncStorage.setItem("fitai_streak", String(s));
        setStreak(s);
      }
    } catch {}
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: topPad }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.username}>{user?.displayName ?? "Athlete"}</Text>
          {streak > 0 && <StreakBadge streak={streak} />}
        </View>
        <TouchableOpacity style={styles.notifBtn} onPress={() => router.push("/(tabs)/profile")}>
          <Ionicons name="person-circle-outline" size={36} color={COLORS.primary} />
        </TouchableOpacity>
      </Animated.View>

      {/* Hero */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.heroBanner}>
        <View style={styles.heroContent}>
          <Text style={styles.heroLabel}>Today's Goal</Text>
          <Text style={styles.heroTitle}>Stay{"\n"}Consistent</Text>
          <TouchableOpacity style={styles.heroBtn} onPress={() => router.push("/(tabs)/workout")}>
            <Text style={styles.heroBtnText}>Start Workout</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.background} />
          </TouchableOpacity>
        </View>
        <View style={styles.heroOrb} />
        <Ionicons name="barbell" size={80} color={COLORS.primary + "18"} style={styles.heroIcon} />
      </Animated.View>

      {/* Stats */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <Text style={styles.sectionTitle}>Today's Stats</Text>
      </Animated.View>
      <View style={styles.statsRow}>
        <StatCard label="Total Reps" value={stats?.total_reps ?? 0} unit="reps" icon="barbell-outline" color={COLORS.primary} delay={250} />
        <StatCard label="Avg Score" value={stats?.avg_score?.toFixed(0) ?? "0"} unit="pts" icon="star-outline" color={COLORS.amber} delay={300} />
        <StatCard label="Calories" value={stats?.calories_burned ?? 0} unit="kcal" icon="flame-outline" color={COLORS.secondary} delay={350} />
      </View>

      {/* All Categories */}
      <Animated.View entering={FadeInDown.delay(400).springify()}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SPACING.xl }}>
          <View style={styles.categoryScroll}>
            {CATEGORY_ROWS.map((cat) => {
              const color = getCategoryColor(cat.id);
              const icon = getCategoryIcon(cat.id);
              const count = EXERCISES.filter(e => e.category === cat.id).length;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryChip, { borderColor: color + "35", backgroundColor: color + "10" }]}
                  onPress={() => router.push({ pathname: "/exercise/[category]", params: { category: cat.id } })}
                  activeOpacity={0.75}
                >
                  <Ionicons name={icon as any} size={20} color={color} />
                  <Text style={[styles.categoryChipName, { color }]}>{cat.label}</Text>
                  <Text style={[styles.categoryChipCount, { color: color + "99" }]}>{count}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Quick Start */}
      <Animated.View entering={FadeInDown.delay(500).springify()}>
        <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>Quick Start</Text>
      </Animated.View>
      <View style={styles.quickList}>
        {QUICK_EXERCISES.map((item, index) => (
          <QuickItem key={item.id} item={item} index={index} />
        ))}
      </View>

      {/* AI Trainer CTA */}
      <Animated.View entering={FadeInDown.delay(650).springify()}>
        <TouchableOpacity
          style={styles.aiTrainerCard}
          onPress={() => router.push("/(tabs)/workout")}
          activeOpacity={0.8}
        >
          <View style={styles.aiLeft}>
            <Ionicons name="flash" size={24} color={COLORS.primary} />
            <View>
              <Text style={styles.aiTitle}>Smart Workout Generator</Text>
              <Text style={styles.aiSub}>AI creates your perfect plan in seconds</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </Animated.View>

      <View style={{ height: SPACING.xxxl + 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING.xl },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
  },
  greeting: { fontFamily: FONTS.regular, fontSize: SIZES.md, color: COLORS.textSecondary },
  username: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.text, marginTop: 2 },
  notifBtn: { padding: 4 },

  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
    backgroundColor: "#F9731615",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#F9731630",
    overflow: "hidden",
  },
  streakGlow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#F97316",
    borderRadius: RADIUS.full,
  },
  streakText: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs, color: "#F97316" },

  heroBanner: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.primary + "20",
    overflow: "hidden",
    minHeight: 160,
  },
  heroContent: { zIndex: 2 },
  heroLabel: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.primary, letterSpacing: 1, textTransform: "uppercase" },
  heroTitle: { fontFamily: FONTS.bold, fontSize: 36, color: COLORS.text, lineHeight: 42, marginTop: 6, marginBottom: SPACING.lg },
  heroBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    gap: SPACING.xs,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  heroBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.sm, color: COLORS.background },
  heroOrb: {
    position: "absolute",
    right: -40,
    top: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.primary + "06",
  },
  heroIcon: { position: "absolute", right: 10, bottom: -10 },

  sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text, marginBottom: SPACING.md },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: SPACING.md },
  seeAll: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.primary },

  statsRow: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.xl },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: "center",
    borderWidth: 1,
    gap: 4,
  },
  statIcon: {
    width: 36, height: 36, borderRadius: RADIUS.md,
    alignItems: "center", justifyContent: "center", marginBottom: 4,
  },
  statValue: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.text },
  statUnit: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textMuted },
  statLabel: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.textSecondary, textAlign: "center" },

  categoryScroll: {
    flexDirection: "row",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
    marginBottom: SPACING.md,
  },
  categoryChip: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    width: 88,
    gap: 4,
  },
  categoryChipName: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs, textAlign: "center" },
  categoryChipCount: { fontFamily: FONTS.regular, fontSize: SIZES.xs },

  quickList: { gap: SPACING.sm, marginBottom: SPACING.md },
  quickItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    borderWidth: 1,
    gap: SPACING.md,
  },
  quickIcon: {
    width: 44, height: 44, borderRadius: RADIUS.md,
    alignItems: "center", justifyContent: "center",
  },
  quickName: { flex: 1, fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.text },

  aiTrainerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primaryDim,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
    marginTop: SPACING.sm,
  },
  aiLeft: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  aiTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text },
  aiSub: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
});
