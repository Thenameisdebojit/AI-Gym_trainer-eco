import React, { useRef } from "react";
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
} from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { fetchStats } from "@/lib/api";
import { COLORS, FONTS, SIZES, RADIUS, SPACING } from "@/constants/theme";
import { getCategoryColor } from "@/constants/exercises";

const { width } = Dimensions.get("window");

const QUICK_EXERCISES = [
  { id: "pushup_normal", name: "Push-up", category: "freehand", icon: "fitness", color: COLORS.secondary },
  { id: "squat_bodyweight", name: "Squat", category: "freehand", icon: "body", color: COLORS.primary },
  { id: "pullup", name: "Pull-up", category: "calisthenics", icon: "barbell", color: COLORS.purple },
  { id: "bench_press", name: "Bench Press", category: "gym", icon: "barbell", color: COLORS.secondary },
];

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

function QuickExerciseItem({ item, index }: { item: typeof QUICK_EXERCISES[0]; index: number }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInRight.delay(index * 80).springify()} style={animStyle}>
      <TouchableOpacity
        onPressIn={() => { scale.value = withSpring(0.95); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={() =>
          router.push({
            pathname: "/exercise/detail",
            params: { id: item.id, category: item.category },
          })
        }
        style={[styles.quickItem, { backgroundColor: item.color + "15", borderColor: item.color + "30" }]}
        activeOpacity={0.8}
      >
        <View style={[styles.quickIcon, { backgroundColor: item.color + "25" }]}>
          <Ionicons name={item.icon as any} size={22} color={item.color} />
        </View>
        <Text style={styles.quickName}>{item.name}</Text>
        <Ionicons name="chevron-forward" size={14} color={item.color} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { data: stats } = useQuery({
    queryKey: ["/workout/stats"],
    queryFn: fetchStats,
    retry: false,
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const topPad = Platform.OS === "web" ? 67 : insets.top;

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
        </View>
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Ionicons name="person-circle-outline" size={36} color={COLORS.primary} />
        </TouchableOpacity>
      </Animated.View>

      {/* Hero Banner */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.heroBanner}>
        <View style={styles.heroContent}>
          <Text style={styles.heroLabel}>Today's Goal</Text>
          <Text style={styles.heroTitle}>Stay{"\n"}Consistent</Text>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={() => router.push("/(tabs)/explore")}
          >
            <Text style={styles.heroBtnText}>Start Workout</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.background} />
          </TouchableOpacity>
        </View>
        <View style={styles.heroOrb} />
        <Ionicons name="barbell" size={80} color={COLORS.primary + "20"} style={styles.heroIcon} />
      </Animated.View>

      {/* Stats Row */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <Text style={styles.sectionTitle}>Today's Stats</Text>
      </Animated.View>
      <View style={styles.statsRow}>
        <StatCard
          label="Total Reps"
          value={stats?.total_reps ?? 0}
          unit="reps"
          icon="barbell-outline"
          color={COLORS.primary}
          delay={250}
        />
        <StatCard
          label="Avg Score"
          value={stats?.avg_score?.toFixed(0) ?? "0"}
          unit="pts"
          icon="star-outline"
          color={COLORS.amber}
          delay={300}
        />
        <StatCard
          label="Calories"
          value={stats?.calories_burned ?? 0}
          unit="kcal"
          icon="flame-outline"
          color={COLORS.secondary}
          delay={350}
        />
      </View>

      {/* Categories */}
      <Animated.View entering={FadeInDown.delay(400).springify()}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryRow}>
          {(["freehand", "gym", "calisthenics"] as const).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryCard, { borderColor: getCategoryColor(cat) + "40", backgroundColor: getCategoryColor(cat) + "10" }]}
              onPress={() => router.push({ pathname: "/exercise/[category]", params: { category: cat } })}
              activeOpacity={0.7}
            >
              <Ionicons
                name={cat === "gym" ? "barbell-outline" : cat === "calisthenics" ? "fitness-outline" : "body-outline"}
                size={28}
                color={getCategoryColor(cat)}
              />
              <Text style={[styles.categoryName, { color: getCategoryColor(cat) }]}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Quick Start */}
      <Animated.View entering={FadeInDown.delay(500).springify()}>
        <Text style={styles.sectionTitle}>Quick Start</Text>
      </Animated.View>
      <View style={styles.quickList}>
        {QUICK_EXERCISES.map((item, index) => (
          <QuickExerciseItem key={item.id} item={item} index={index} />
        ))}
      </View>

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
    backgroundColor: COLORS.primary + "08",
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
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  statValue: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.text },
  statUnit: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textMuted },
  statLabel: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.textSecondary, textAlign: "center" },
  categoryRow: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.xl },
  categoryCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: "center",
    borderWidth: 1,
    gap: SPACING.sm,
  },
  categoryName: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs, textAlign: "center" },
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
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  quickName: { flex: 1, fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.text },
});
