import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS, FONTS, SIZES, RADIUS, SPACING } from "@/constants/theme";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWorkoutStore, WorkoutHistory } from "@/store/useWorkoutStore";
import { useTranslation } from "@/context/LanguageContext";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  return `${m}m`;
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function WeeklyBar({ history }: { history: WorkoutHistory[] }) {
  const now = new Date();
  const dayOfWeek = now.getDay();

  const weekData = DAYS.map((day, i) => {
    const diff = i - dayOfWeek;
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + diff);
    const targetStr = targetDate.toDateString();

    const dayWorkouts = history.filter((h) => new Date(h.date).toDateString() === targetStr);
    const calories = dayWorkouts.reduce((a, h) => a + h.totalCalories, 0);
    return { day, calories, count: dayWorkouts.length, isToday: diff === 0 };
  });

  const maxCal = Math.max(...weekData.map((d) => d.calories), 1);

  return (
    <View style={chart.container}>
      {weekData.map((d) => (
        <View key={d.day} style={chart.col}>
          <View style={chart.barBg}>
            <View
              style={[
                chart.bar,
                {
                  height: `${Math.max((d.calories / maxCal) * 100, d.count > 0 ? 8 : 0)}%`,
                  backgroundColor: d.isToday ? COLORS.primary : d.count > 0 ? COLORS.primary + "70" : COLORS.surfaceLight,
                },
              ]}
            />
          </View>
          <Text style={[chart.label, d.isToday && { color: COLORS.primary }]}>{d.day}</Text>
        </View>
      ))}
    </View>
  );
}

function HistoryCard({ item }: { item: WorkoutHistory }) {
  return (
    <View style={styles.histCard}>
      <View style={styles.histDateBox}>
        <Text style={styles.histMonth}>
          {new Date(item.date).toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
        </Text>
        <Text style={styles.histDay}>{new Date(item.date).getDate()}</Text>
      </View>
      <View style={styles.histBody}>
        <View style={styles.histTopRow}>
          <Text style={styles.histName} numberOfLines={1}>{item.planName}</Text>
          <Text style={styles.histDateLabel}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.histStats}>
          <View style={styles.histStat}>
            <Ionicons name="flame-outline" size={12} color={COLORS.secondary} />
            <Text style={styles.histStatText}>{item.totalCalories} kcal</Text>
          </View>
          <View style={styles.histStat}>
            <Ionicons name="time-outline" size={12} color={COLORS.blue} />
            <Text style={styles.histStatText}>{formatDuration(item.durationSeconds)}</Text>
          </View>
          <View style={styles.histStat}>
            <Ionicons name="layers-outline" size={12} color={COLORS.purple} />
            <Text style={styles.histStatText}>{item.exerciseCount} ex.</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { history, loadHistory } = useWorkoutStore();
  const [streak, setStreak] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    loadHistory();
    AsyncStorage.getItem("fitai_streak").then((s) => {
      if (s) setStreak(parseInt(s, 10));
    });
  }, []);

  const totalWorkouts = history.length;
  const totalCalories = history.reduce((a, h) => a + h.totalCalories, 0);
  const totalMinutes = Math.round(history.reduce((a, h) => a + h.durationSeconds, 0) / 60);
  const totalReps = history.reduce((a, h) => a + h.totalReps, 0);

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const thisWeekHistory = history.filter((h) => h.date >= weekStart.getTime());
  const thisWeekCal = thisWeekHistory.reduce((a, h) => a + h.totalCalories, 0);
  const thisWeekMin = Math.round(thisWeekHistory.reduce((a, h) => a + h.durationSeconds, 0) / 60);

  const recentHistory = history.slice(0, 5);

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
          <Text style={styles.title}>{t("report")}</Text>
          <Text style={styles.subtitle}>{t("progressTrack")}</Text>
        </Animated.View>

        {/* Top Stats */}
        <Animated.View entering={FadeInDown.delay(80).springify()} style={styles.topStatsRow}>
          {[
            { label: t("totalWorkouts"), value: totalWorkouts, icon: "barbell-outline", color: COLORS.primary },
            { label: t("totalCalories"), value: totalCalories, icon: "flame-outline", color: COLORS.secondary },
            { label: t("totalMinutes"), value: totalMinutes, icon: "time-outline", color: COLORS.blue },
          ].map(({ label, value, icon, color }) => (
            <View key={label} style={[styles.topStatCard, { borderColor: color + "30" }]}>
              <Ionicons name={icon as any} size={20} color={color} />
              <Text style={[styles.topStatValue, { color }]}>{value}</Text>
              <Text style={styles.topStatLabel}>{label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Streak */}
        <Animated.View entering={FadeInDown.delay(160).springify()} style={styles.streakCard}>
          <View style={styles.streakLeft}>
            <Ionicons name="flame" size={36} color={COLORS.secondary} />
            <View>
              <Text style={styles.streakValue}>{streak}</Text>
              <Text style={styles.streakLabel}>{t("streak")}</Text>
            </View>
          </View>
          <View style={styles.streakRight}>
            <Text style={styles.streakSub}>{t("keepItUp")}</Text>
            <Text style={styles.streakSub2}>{t("trainToday")}</Text>
          </View>
        </Animated.View>

        {/* Weekly Activity Chart */}
        <Animated.View entering={FadeInDown.delay(240).springify()} style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>{t("weeklyActivity")}</Text>
            <Text style={styles.chartSub}>{thisWeekCal} kcal · {thisWeekMin} min</Text>
          </View>
          <WeeklyBar history={history} />
          <View style={styles.chartLegendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.legendText}>Today</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary + "70" }]} />
              <Text style={styles.legendText}>Workout day</Text>
            </View>
          </View>
        </Animated.View>

        {/* Weekly Summary */}
        <Animated.View entering={FadeInDown.delay(320).springify()}>
          <Text style={styles.sectionTitle}>{t("thisWeek")}</Text>
          <View style={styles.weekRow}>
            <View style={styles.weekCard}>
              <Text style={styles.weekValue}>{thisWeekHistory.length}</Text>
              <Text style={styles.weekLabel}>{t("workouts")}</Text>
            </View>
            <View style={styles.weekCard}>
              <Text style={styles.weekValue}>{thisWeekCal}</Text>
              <Text style={styles.weekLabel}>{t("calories")}</Text>
            </View>
            <View style={styles.weekCard}>
              <Text style={styles.weekValue}>{thisWeekMin}</Text>
              <Text style={styles.weekLabel}>{t("minutes")}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Lifetime Stats */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Text style={styles.sectionTitle}>{t("lifetimeStats")}</Text>
          <View style={styles.lifetimeGrid}>
            {[
              { label: t("totalReps"), value: totalReps, icon: "barbell-outline", color: COLORS.primary },
              { label: t("sessions"), value: totalWorkouts, icon: "checkmark-circle-outline", color: COLORS.purple },
              { label: t("calories"), value: totalCalories, icon: "flame-outline", color: COLORS.secondary },
              { label: t("minutes"), value: totalMinutes, icon: "time-outline", color: COLORS.blue },
            ].map(({ label, value, icon, color }) => (
              <View key={label} style={[styles.lifetimeCard, { borderColor: color + "30" }]}>
                <Ionicons name={icon as any} size={22} color={color} />
                <Text style={styles.lifetimeValue}>{value}</Text>
                <Text style={styles.lifetimeLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Workouts */}
        <Animated.View entering={FadeInDown.delay(480).springify()}>
          <View style={styles.recentHeader}>
            <Text style={styles.sectionTitle}>{t("recentWorkouts")}</Text>
            <TouchableOpacity onPress={() => router.push("/workout/history")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="fitness-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>{t("noWorkoutsYet")}</Text>
              <Text style={styles.emptySub}>{t("completeWorkout")}</Text>
              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => router.replace("/(tabs)/workout")}
              >
                <Ionicons name="barbell" size={16} color={COLORS.background} />
                <Text style={styles.startBtnText}>{t("startWorkout")}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            recentHistory.map((item) => <HistoryCard key={item.id} item={item} />)
          )}
        </Animated.View>

        {/* History Link */}
        {recentHistory.length > 0 && (
          <Animated.View entering={FadeInDown.delay(560).springify()}>
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
                  <Text style={styles.historyLinkTitle}>{t("history")}</Text>
                  <Text style={styles.historyLinkSub}>
                    {history.length} session{history.length !== 1 ? "s" : ""} recorded
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={{ height: SPACING.xxxl + 20 }} />
      </ScrollView>
    </View>
  );
}

const chart = StyleSheet.create({
  container: { flexDirection: "row", height: 110, alignItems: "flex-end", gap: 6, marginBottom: SPACING.sm },
  col: { flex: 1, alignItems: "center", gap: 6 },
  barBg: {
    flex: 1, width: "100%", backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.sm, overflow: "hidden", justifyContent: "flex-end",
  },
  bar: { width: "100%", borderRadius: RADIUS.sm },
  label: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textMuted },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING.xl },

  header: { marginBottom: SPACING.lg, marginTop: SPACING.md },
  title: { fontFamily: FONTS.bold, fontSize: SIZES.xxxl, color: COLORS.text },
  subtitle: { fontFamily: FONTS.regular, fontSize: SIZES.md, color: COLORS.textSecondary, marginTop: 4 },

  topStatsRow: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.lg },
  topStatCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.md, alignItems: "center", borderWidth: 1, gap: SPACING.xs,
  },
  topStatValue: { fontFamily: FONTS.bold, fontSize: SIZES.xl },
  topStatLabel: { fontFamily: FONTS.regular, fontSize: 9, color: COLORS.textSecondary, textAlign: "center" },

  streakCard: {
    backgroundColor: COLORS.secondaryDim, borderRadius: RADIUS.xl,
    padding: SPACING.base, borderWidth: 1, borderColor: COLORS.secondary + "30",
    flexDirection: "row", alignItems: "center", gap: SPACING.md, marginBottom: SPACING.xl,
  },
  streakLeft: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  streakValue: { fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.secondary, lineHeight: SIZES.title + 4 },
  streakLabel: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.secondary },
  streakRight: { flex: 1 },
  streakSub: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.text },
  streakSub2: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 4 },

  chartCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border,
  },
  chartHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: SPACING.lg },
  chartTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text },
  chartSub: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.primary },
  chartLegendRow: { flexDirection: "row", gap: SPACING.lg, marginTop: SPACING.sm },
  legendItem: { flexDirection: "row", alignItems: "center", gap: SPACING.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textMuted },

  sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text, marginBottom: SPACING.md },

  weekRow: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.xl },
  weekCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.base, alignItems: "center", borderWidth: 1, borderColor: COLORS.border,
  },
  weekValue: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.primary },
  weekLabel: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 4, textAlign: "center" },

  lifetimeGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm, marginBottom: SPACING.xl },
  lifetimeCard: {
    width: "47.5%", backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.base, alignItems: "center", borderWidth: 1, gap: SPACING.xs,
  },
  lifetimeValue: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.text },
  lifetimeLabel: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, textAlign: "center" },

  recentHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: SPACING.md },
  seeAll: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.primary },

  histCard: {
    flexDirection: "row", backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.base, borderWidth: 1, borderColor: COLORS.border,
    marginBottom: SPACING.sm, gap: SPACING.md, alignItems: "center",
  },
  histDateBox: {
    width: 44, height: 52, borderRadius: RADIUS.md, backgroundColor: COLORS.primaryDim,
    borderWidth: 1, borderColor: COLORS.primary + "30", alignItems: "center", justifyContent: "center",
  },
  histMonth: { fontFamily: FONTS.bold, fontSize: SIZES.xs, color: COLORS.primary },
  histDay: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.primary, lineHeight: 26 },
  histBody: { flex: 1, gap: SPACING.xs },
  histTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  histName: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.text, flex: 1 },
  histDateLabel: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textMuted },
  histStats: { flexDirection: "row", gap: SPACING.md },
  histStat: { flexDirection: "row", alignItems: "center", gap: 3 },
  histStatText: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textSecondary },

  emptyState: { alignItems: "center", paddingVertical: SPACING.xxxl, gap: SPACING.md },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.text },
  emptySub: { fontFamily: FONTS.regular, fontSize: SIZES.base, color: COLORS.textSecondary, textAlign: "center" },
  startBtn: {
    flexDirection: "row", alignItems: "center", gap: SPACING.sm,
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm + 2, marginTop: SPACING.sm,
  },
  startBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.background },

  historyLink: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: COLORS.primaryDim, borderRadius: RADIUS.xl,
    padding: SPACING.base, borderWidth: 1, borderColor: COLORS.primary + "30", marginTop: SPACING.md,
  },
  historyLinkLeft: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  historyLinkIcon: {
    width: 44, height: 44, borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary + "20", alignItems: "center", justifyContent: "center",
  },
  historyLinkTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text },
  historyLinkSub: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
});
