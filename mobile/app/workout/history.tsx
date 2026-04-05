import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS, FONTS, SIZES, RADIUS, SPACING } from "@/constants/theme";
import { useWorkoutStore, WorkoutHistory } from "@/store/useWorkoutStore";
import { useTranslation } from "@/context/LanguageContext";
import { getCategoryImage } from "@/utils/getCategoryImage";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return s > 0 ? `${m}:${s.toString().padStart(2, "0")}` : `${m}m`;
}

function getWeekRange(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const fmt = (dt: Date) =>
    dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

function getWeekKey(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  return start.toISOString().split("T")[0];
}

interface WeekGroup {
  key: string;
  range: string;
  workouts: WorkoutHistory[];
  totalCalories: number;
  totalSeconds: number;
}

function groupByWeek(history: WorkoutHistory[]): WeekGroup[] {
  const map: Record<string, WeekGroup> = {};
  for (const w of history) {
    const d = new Date(w.date);
    const key = getWeekKey(d);
    if (!map[key]) {
      map[key] = {
        key,
        range: getWeekRange(d),
        workouts: [],
        totalCalories: 0,
        totalSeconds: 0,
      };
    }
    map[key].workouts.push(w);
    map[key].totalCalories += w.totalCalories;
    map[key].totalSeconds += w.durationSeconds;
  }
  return Object.values(map).sort((a, b) => b.key.localeCompare(a.key));
}

function CalendarView({ history, year, month, onPrev, onNext }: {
  history: WorkoutHistory[];
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const today = new Date();

  const workoutDays = new Set(
    history
      .filter((h) => {
        const d = new Date(h.date);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .map((h) => new Date(h.date).getDate())
  );

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month, 1).toLocaleDateString("en-US", { year: "numeric", month: "long" });
  const isCurrentYear = year === today.getFullYear();
  const isCurrentMonth = month === today.getMonth() && isCurrentYear;

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <View style={cal.container}>
      <View style={cal.header}>
        <TouchableOpacity onPress={onPrev} style={cal.navBtn}>
          <Ionicons name="chevron-back" size={18} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={cal.monthLabel}>{monthName}</Text>
        <TouchableOpacity onPress={onNext} style={cal.navBtn}>
          <Ionicons name="chevron-forward" size={18} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={cal.weekRow}>
        {WEEKDAYS.map((d, i) => (
          <View key={i} style={cal.weekCell}>
            <Text style={cal.weekDay}>{d}</Text>
          </View>
        ))}
      </View>

      {Array.from({ length: cells.length / 7 }, (_, row) => (
        <View key={row} style={cal.weekRow}>
          {cells.slice(row * 7, row * 7 + 7).map((day, col) => {
            if (!day) return <View key={col} style={cal.dayCell} />;
            const isToday = isCurrentMonth && day === today.getDate();
            const hasWorkout = workoutDays.has(day);
            return (
              <View key={col} style={cal.dayCell}>
                <View
                  style={[
                    cal.dayInner,
                    isToday && cal.dayToday,
                    hasWorkout && !isToday && cal.dayWorkout,
                  ]}
                >
                  <Text
                    style={[
                      cal.dayText,
                      isToday && cal.dayTodayText,
                      hasWorkout && !isToday && cal.dayWorkoutText,
                    ]}
                  >
                    {day}
                  </Text>
                </View>
                {hasWorkout && !isToday && (
                  <View style={cal.dotIndicator} />
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function WorkoutCard({ item }: { item: WorkoutHistory }) {
  const imageUrl = getCategoryImage(item.planName.toLowerCase().includes("leg") ? "legs"
    : item.planName.toLowerCase().includes("chest") ? "chest"
    : item.planName.toLowerCase().includes("arm") ? "arms"
    : item.planName.toLowerCase().includes("ab") || item.planName.toLowerCase().includes("core") ? "abs"
    : item.planName.toLowerCase().includes("back") ? "back"
    : item.planName.toLowerCase().includes("shoulder") ? "shoulders"
    : item.planName.toLowerCase().includes("cardio") ? "cardio"
    : "fullbody");

  const time = new Date(item.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const date = new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <View style={wc.card}>
      <Image source={{ uri: imageUrl }} style={wc.thumb} resizeMode="cover" />
      <View style={wc.body}>
        <Text style={wc.name} numberOfLines={1}>{item.planName}</Text>
        <Text style={wc.date}>{date}, {time}</Text>
        <View style={wc.stats}>
          <View style={wc.stat}>
            <Ionicons name="time-outline" size={12} color={COLORS.blue} />
            <Text style={wc.statText}>{formatDuration(item.durationSeconds)}</Text>
          </View>
          <View style={wc.stat}>
            <Ionicons name="flame-outline" size={12} color={COLORS.secondary} />
            <Text style={wc.statText}>{item.totalCalories} Kcal</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function WorkoutHistoryScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const { history, loadHistory, clearHistory } = useWorkoutStore();
  const { t } = useTranslation();

  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClear = () => {
    Alert.alert("Clear History?", "All your workout history will be deleted.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: clearHistory },
    ]);
  };

  const handlePrevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };

  const handleNextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const totalReps = history.reduce((a, h) => a + h.totalReps, 0);
  const totalCals = history.reduce((a, h) => a + h.totalCalories, 0);
  const totalMin = Math.round(history.reduce((a, h) => a + h.durationSeconds, 0) / 60);
  const totalSessions = history.length;

  const weekGroups = groupByWeek(history);

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("history")}</Text>
        {history.length > 0 ? (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Top Stats */}
        {history.length > 0 && (
          <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.topStats}>
            {[
              { label: "Exercises", value: totalSessions, icon: "barbell-outline", color: COLORS.primary },
              { label: "kcal", value: totalCals, icon: "flame-outline", color: COLORS.secondary },
              { label: "Minutes", value: totalMin, icon: "time-outline", color: COLORS.blue },
            ].map(({ label, value, icon, color }) => (
              <View key={label} style={[styles.topStat, { borderColor: color + "30" }]}>
                <Ionicons name={icon as any} size={18} color={color} />
                <Text style={[styles.topStatVal, { color }]}>{value}</Text>
                <Text style={styles.topStatLbl}>{label}</Text>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Calendar */}
        <Animated.View entering={FadeInDown.delay(60).springify()} style={styles.calCard}>
          <CalendarView
            history={history}
            year={calYear}
            month={calMonth}
            onPrev={handlePrevMonth}
            onNext={handleNextMonth}
          />

          {history.length > 0 && (
            <View style={styles.streakRow}>
              <View style={styles.streakItem}>
                <Text style={styles.streakLbl}>Current Streak</Text>
                <View style={styles.streakVal}>
                  <Ionicons name="flame" size={14} color={COLORS.secondary} />
                  <Text style={styles.streakNum}>
                    {history.length > 0 ? (() => {
                      let streak = 0;
                      const today = new Date();
                      for (let i = 0; i < 365; i++) {
                        const d = new Date(today);
                        d.setDate(today.getDate() - i);
                        const dayStr = d.toDateString();
                        if (history.some(h => new Date(h.date).toDateString() === dayStr)) streak++;
                        else if (i > 0) break;
                      }
                      return streak;
                    })() : 0}
                  </Text>
                </View>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakItem}>
                <Text style={styles.streakLbl}>Best Streak</Text>
                <View style={styles.streakVal}>
                  <Ionicons name="trophy-outline" size={14} color={COLORS.amber} />
                  <Text style={[styles.streakNum, { color: COLORS.amber }]}>
                    {totalSessions} days
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>

        {history.length === 0 ? (
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="fitness-outline" size={56} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>{t("noWorkoutsYet")}</Text>
            <Text style={styles.emptySub}>{t("completeWorkout")}</Text>
            <TouchableOpacity style={styles.startBtn} onPress={() => router.replace("/(tabs)/workout")}>
              <Ionicons name="barbell" size={18} color={COLORS.background} />
              <Text style={styles.startBtnText}>{t("startWorkout")}</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <>
            {/* Weekly Summary */}
            <Animated.View entering={FadeInDown.delay(120).springify()}>
              <Text style={styles.sectionTitle}>{t("weeklySummary")}</Text>
            </Animated.View>

            {weekGroups.map((group, gi) => (
              <Animated.View key={group.key} entering={FadeInDown.delay(140 + gi * 40).springify()}>
                {/* Week header */}
                <View style={styles.weekHeader}>
                  <View>
                    <Text style={styles.weekRange}>{group.range}</Text>
                    <Text style={styles.weekMeta}>
                      {group.workouts.length} Workout{group.workouts.length !== 1 ? "s" : ""}
                    </Text>
                  </View>
                  <View style={styles.weekRight}>
                    <View style={styles.weekStat}>
                      <Ionicons name="time-outline" size={13} color={COLORS.blue} />
                      <Text style={styles.weekStatText}>{formatDuration(group.totalSeconds)}</Text>
                    </View>
                    <View style={styles.weekStat}>
                      <Ionicons name="flame-outline" size={13} color={COLORS.secondary} />
                      <Text style={styles.weekStatText}>{group.totalCalories} Kcal</Text>
                    </View>
                  </View>
                </View>

                {/* Workout cards in this week */}
                {group.workouts.map((item) => (
                  <WorkoutCard key={item.id} item={item} />
                ))}
              </Animated.View>
            ))}
          </>
        )}

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </View>
  );
}

const cal = StyleSheet.create({
  container: { paddingVertical: SPACING.sm },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: SPACING.md },
  navBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.surfaceLight, alignItems: "center", justifyContent: "center",
  },
  monthLabel: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text },
  weekRow: { flexDirection: "row", marginBottom: 4 },
  weekCell: { flex: 1, alignItems: "center", paddingVertical: 4 },
  weekDay: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.textMuted },
  dayCell: { flex: 1, alignItems: "center", paddingVertical: 2 },
  dayInner: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: "center", justifyContent: "center",
  },
  dayToday: { backgroundColor: COLORS.text },
  dayWorkout: { backgroundColor: COLORS.primary + "20" },
  dayText: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary },
  dayTodayText: { fontFamily: FONTS.bold, color: COLORS.background },
  dayWorkoutText: { fontFamily: FONTS.semiBold, color: COLORS.primary },
  dotIndicator: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: COLORS.primary, marginTop: 2,
  },
});

const wc = StyleSheet.create({
  card: {
    flexDirection: "row", gap: SPACING.md,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
    marginBottom: SPACING.sm, alignItems: "center",
  },
  thumb: {
    width: 60, height: 60, borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
  },
  body: { flex: 1, gap: 3 },
  name: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.text },
  date: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textMuted },
  stats: { flexDirection: "row", gap: SPACING.md, marginTop: 2 },
  stat: { flexDirection: "row", alignItems: "center", gap: 3 },
  statText: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.textSecondary },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: SPACING.base, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 40, height: 40, alignItems: "center", justifyContent: "center",
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  headerTitle: { flex: 1, textAlign: "center", fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text },
  clearBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },

  content: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg },

  topStats: {
    flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.lg,
  },
  topStat: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.md, alignItems: "center", borderWidth: 1, gap: SPACING.xs,
  },
  topStatVal: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.text },
  topStatLbl: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textSecondary },

  calCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.base, borderWidth: 1, borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },

  streakRow: {
    flexDirection: "row", marginTop: SPACING.md,
    paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  streakItem: { flex: 1, alignItems: "center", gap: 4 },
  streakLbl: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textMuted },
  streakVal: { flexDirection: "row", alignItems: "center", gap: 4 },
  streakNum: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.secondary },
  streakDivider: { width: 1, backgroundColor: COLORS.border },

  sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text, marginBottom: SPACING.md },

  weekHeader: {
    flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between",
    marginBottom: SPACING.sm, paddingBottom: SPACING.sm,
    borderBottomWidth: 1, borderBottomColor: COLORS.border + "50",
    marginTop: SPACING.md,
  },
  weekRange: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text },
  weekMeta: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  weekRight: { alignItems: "flex-end", gap: 4 },
  weekStat: { flexDirection: "row", alignItems: "center", gap: 4 },
  weekStatText: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.textSecondary },

  emptyState: { alignItems: "center", paddingTop: SPACING.xxxl, gap: SPACING.md },
  emptyIcon: {
    width: 100, height: 100, borderRadius: RADIUS.xxl,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    alignItems: "center", justifyContent: "center",
  },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.text },
  emptySub: { fontFamily: FONTS.regular, fontSize: SIZES.base, color: COLORS.textSecondary, textAlign: "center" },
  startBtn: {
    flexDirection: "row", alignItems: "center", gap: SPACING.sm,
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm + 2, marginTop: SPACING.md,
  },
  startBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.background },
});
