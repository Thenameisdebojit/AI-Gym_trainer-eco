import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";
import { fetchStats } from "@/lib/api";
import { COLORS, FONTS, SIZES, RADIUS, SPACING } from "@/constants/theme";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWorkoutStore } from "@/store/useWorkoutStore";

const WEEKLY_DATA = [
  { day: "Mon", reps: 45, calories: 120 },
  { day: "Tue", reps: 60, calories: 165 },
  { day: "Wed", reps: 30, calories: 85 },
  { day: "Thu", reps: 75, calories: 200 },
  { day: "Fri", reps: 55, calories: 150 },
  { day: "Sat", reps: 90, calories: 240 },
  { day: "Sun", reps: 20, calories: 55 },
];
const MAX_REPS = Math.max(...WEEKLY_DATA.map(d => d.reps));

function BarChart() {
  return (
    <View style={chart.container}>
      {WEEKLY_DATA.map((d) => (
        <View key={d.day} style={chart.col}>
          <View style={chart.barBg}>
            <View
              style={[
                chart.bar,
                {
                  height: `${(d.reps / MAX_REPS) * 100}%`,
                  backgroundColor: d.reps === MAX_REPS ? COLORS.primary : COLORS.primary + "50",
                },
              ]}
            />
          </View>
          <Text style={chart.label}>{d.day}</Text>
        </View>
      ))}
    </View>
  );
}

const chart = StyleSheet.create({
  container: { flexDirection: "row", height: 120, alignItems: "flex-end", gap: 6, marginBottom: SPACING.sm },
  col: { flex: 1, alignItems: "center", gap: 6 },
  barBg: { flex: 1, width: "100%", backgroundColor: COLORS.surfaceLight, borderRadius: RADIUS.sm, overflow: "hidden", justifyContent: "flex-end" },
  bar: { width: "100%", borderRadius: RADIUS.sm },
  label: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textMuted },
});

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/workout/stats"],
    queryFn: fetchStats,
    retry: false,
  });
  const { history, loadHistory } = useWorkoutStore();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    loadHistory();
    AsyncStorage.getItem("fitai_streak").then(s => {
      if (s) setStreak(parseInt(s, 10));
    });
  }, []);

  const weekTotal = WEEKLY_DATA.reduce((a, d) => a + d.reps, 0) + history.reduce((a, h) => a + h.totalReps, 0);
  const weekCal = WEEKLY_DATA.reduce((a, d) => a + d.calories, 0) + history.reduce((a, h) => a + h.totalCalories, 0);

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>Track your fitness journey</Text>
        </Animated.View>

        {/* Streak */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.streakCard}>
          <View style={styles.streakLeft}>
            <Ionicons name="flame" size={40} color={COLORS.secondary} />
            <View>
              <Text style={styles.streakValue}>{streak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </View>
          <View style={styles.streakRight}>
            <Text style={styles.streakSub}>Keep it up!</Text>
            <Text style={styles.streakSub2}>Train today to continue your streak</Text>
          </View>
        </Animated.View>

        {/* Lifetime Stats */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Text style={styles.sectionTitle}>Lifetime Stats</Text>
        </Animated.View>
        {isLoading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginVertical: SPACING.xl }} />
        ) : (
          <View style={styles.lifetimeGrid}>
            {[
              { label: "Total Reps", value: stats?.total_reps ?? 0, icon: "barbell-outline", color: COLORS.primary },
              { label: "Avg Score", value: stats?.avg_score?.toFixed(1) ?? "0.0", icon: "star-outline", color: COLORS.amber },
              { label: "Calories", value: stats?.calories_burned ?? 0, icon: "flame-outline", color: COLORS.secondary },
              { label: "Sessions", value: stats?.total_workouts ?? 0, icon: "checkmark-circle-outline", color: COLORS.purple },
            ].map(({ label, value, icon, color }) => (
              <View key={label} style={[styles.lifetimeCard, { borderColor: color + "30" }]}>
                <Ionicons name={icon as any} size={22} color={color} />
                <Text style={styles.lifetimeValue}>{value}</Text>
                <Text style={styles.lifetimeLabel}>{label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Weekly Chart */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Weekly Reps</Text>
            <Text style={styles.chartTotal}>{weekTotal} total</Text>
          </View>
          <BarChart />
          <View style={styles.chartFooter}>
            <View style={styles.chartLegend}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.legendText}>Best day</Text>
            </View>
            <View style={styles.chartLegend}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary + "50" }]} />
              <Text style={styles.legendText}>Other days</Text>
            </View>
          </View>
        </Animated.View>

        {/* This Week summary */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.weekRow}>
            <View style={styles.weekCard}>
              <Text style={styles.weekValue}>{weekTotal}</Text>
              <Text style={styles.weekLabel}>Total Reps</Text>
            </View>
            <View style={styles.weekCard}>
              <Text style={styles.weekValue}>{weekCal}</Text>
              <Text style={styles.weekLabel}>Calories</Text>
            </View>
            <View style={styles.weekCard}>
              <Text style={styles.weekValue}>{history.length + WEEKLY_DATA.filter(d => d.reps > 0).length}</Text>
              <Text style={styles.weekLabel}>Sessions</Text>
            </View>
          </View>
        </Animated.View>

        {/* Workout History Link */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <TouchableOpacity
            style={styles.historyLink}
            onPress={() => router.push("/workout/history")}
            activeOpacity={0.8}
          >
            <View style={styles.historyLinkLeft}>
              <View style={styles.historyLinkIcon}>
                <Ionicons name="time" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.historyLinkTitle}>Workout History</Text>
                <Text style={styles.historyLinkSub}>{history.length} session{history.length !== 1 ? "s" : ""} recorded</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: SPACING.xxxl + 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING.xl },
  header: { marginBottom: SPACING.lg, marginTop: SPACING.md },
  title: { fontFamily: FONTS.bold, fontSize: SIZES.xxxl, color: COLORS.text },
  subtitle: { fontFamily: FONTS.regular, fontSize: SIZES.md, color: COLORS.textSecondary, marginTop: 4 },
  streakCard: {
    backgroundColor: COLORS.secondaryDim,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.secondary + "30",
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.base,
    marginBottom: SPACING.xl,
  },
  streakLeft: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  streakValue: { fontFamily: FONTS.bold, fontSize: SIZES.hero, color: COLORS.secondary, lineHeight: SIZES.hero },
  streakLabel: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.secondary },
  streakRight: { flex: 1 },
  streakSub: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.text },
  streakSub2: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 4 },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text, marginBottom: SPACING.md },
  lifetimeGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm, marginBottom: SPACING.xl },
  lifetimeCard: {
    width: "47.5%",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    alignItems: "center",
    borderWidth: 1,
    gap: SPACING.xs,
  },
  lifetimeValue: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.text },
  lifetimeLabel: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, textAlign: "center" },
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chartHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: SPACING.lg },
  chartTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text },
  chartTotal: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.primary },
  chartFooter: { flexDirection: "row", gap: SPACING.lg, marginTop: SPACING.sm },
  chartLegend: { flexDirection: "row", alignItems: "center", gap: SPACING.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textMuted },
  weekRow: { flexDirection: "row", gap: SPACING.sm },
  weekCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  weekValue: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.primary },
  weekLabel: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 4, textAlign: "center" },
  historyLink: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: COLORS.primaryDim, borderRadius: RADIUS.xl,
    padding: SPACING.base, borderWidth: 1, borderColor: COLORS.primary + "30",
    marginTop: SPACING.md,
  },
  historyLinkLeft: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  historyLinkIcon: {
    width: 44, height: 44, borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary + "20", alignItems: "center", justifyContent: "center",
  },
  historyLinkTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text },
  historyLinkSub: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
});
