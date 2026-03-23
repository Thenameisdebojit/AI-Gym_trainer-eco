import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS, FONTS, SIZES, RADIUS, SPACING } from "@/constants/theme";
import { useWorkoutStore, WorkoutHistory } from "@/store/useWorkoutStore";

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function HistoryCard({ item, index }: { item: WorkoutHistory; index: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={styles.dateBox}>
            <Text style={styles.dateMonth}>
              {new Date(item.date).toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
            </Text>
            <Text style={styles.dateDay}>{new Date(item.date).getDate()}</Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.planName}</Text>
            <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <Ionicons name="barbell-outline" size={13} color={COLORS.primary} />
              <Text style={styles.statText}>{item.totalReps} reps</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="flame-outline" size={13} color={COLORS.secondary} />
              <Text style={styles.statText}>{item.totalCalories} kcal</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={13} color={COLORS.blue} />
              <Text style={styles.statText}>{formatDuration(item.durationSeconds)}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="layers-outline" size={13} color={COLORS.purple} />
              <Text style={styles.statText}>{item.exerciseCount} ex.</Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export default function WorkoutHistoryScreen() {
  const insets = useSafeAreaInsets();
  const { history, loadHistory, clearHistory } = useWorkoutStore();

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClear = () => {
    Alert.alert("Clear History?", "All your workout history will be deleted.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: clearHistory,
      },
    ]);
  };

  const totalReps = history.reduce((a, h) => a + h.totalReps, 0);
  const totalCals = history.reduce((a, h) => a + h.totalCalories, 0);
  const totalSessions = history.length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workout History</Text>
        {history.length > 0 ? (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {history.length > 0 && (
          <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalSessions}</Text>
              <Text style={styles.summaryLabel}>Sessions</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalReps}</Text>
              <Text style={styles.summaryLabel}>Total Reps</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalCals}</Text>
              <Text style={styles.summaryLabel}>Calories</Text>
            </View>
          </Animated.View>
        )}

        {history.length === 0 ? (
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="fitness-outline" size={56} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No workouts yet</Text>
            <Text style={styles.emptySub}>Complete a workout to see your history here.</Text>
            <TouchableOpacity style={styles.startBtn} onPress={() => router.replace("/(tabs)/workout")}>
              <Ionicons name="barbell" size={18} color={COLORS.background} />
              <Text style={styles.startBtnText}>Start a Workout</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            {history.map((item, i) => (
              <HistoryCard key={item.id} item={item} index={i} />
            ))}
          </>
        )}

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: SPACING.base, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 40, height: 40, alignItems: "center", justifyContent: "center",
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
  },
  headerTitle: { flex: 1, textAlign: "center", fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text },
  clearBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },

  content: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg },

  summaryRow: {
    flexDirection: "row", backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl, padding: SPACING.lg,
    borderWidth: 1, borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryValue: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.text },
  summaryLabel: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: COLORS.border },

  sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text, marginBottom: SPACING.md },

  card: {
    flexDirection: "row", backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl, padding: SPACING.base,
    borderWidth: 1, borderColor: COLORS.border,
    marginBottom: SPACING.sm, gap: SPACING.md, alignItems: "center",
  },
  cardLeft: {},
  dateBox: {
    width: 44, height: 52, borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryDim, borderWidth: 1, borderColor: COLORS.primary + "30",
    alignItems: "center", justifyContent: "center",
  },
  dateMonth: { fontFamily: FONTS.bold, fontSize: SIZES.xs, color: COLORS.primary },
  dateDay: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.primary, lineHeight: 26 },
  cardBody: { flex: 1, gap: SPACING.xs },
  cardTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.text, flex: 1 },
  cardDate: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textMuted },
  cardStats: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  statItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  statText: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textSecondary },

  emptyState: { alignItems: "center", paddingTop: SPACING.xxxl * 1.5, gap: SPACING.md },
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
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm + 2,
    marginTop: SPACING.md,
  },
  startBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.background },
});
