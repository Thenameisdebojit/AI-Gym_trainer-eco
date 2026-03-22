import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { COLORS, FONTS, SIZES, RADIUS, SPACING } from "@/constants/theme";
import { EXERCISES, ExerciseCategory, getCategoryColor, DifficultyLevel } from "@/constants/exercises";

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner: COLORS.primary,
  intermediate: COLORS.amber,
  advanced: COLORS.secondary,
};

export default function ExerciseDetail() {
  const { id, category } = useLocalSearchParams<{ id: string; category: ExerciseCategory }>();
  const insets = useSafeAreaInsets();

  const exercise = EXERCISES.find(e => e.id === id);
  if (!exercise) return null;

  const color = getCategoryColor(exercise.category);
  const diffColor = DIFFICULTY_COLORS[exercise.difficulty];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercise Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <Animated.View entering={FadeInDown.delay(0).springify()} style={[styles.heroCard, { borderColor: color + "30" }]}>
          <View style={[styles.heroIcon, { backgroundColor: color + "20" }]}>
            <Ionicons name={exercise.icon as any} size={56} color={color} />
          </View>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseDesc}>{exercise.description}</Text>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: diffColor + "20" }]}>
              <Ionicons name="flash" size={12} color={diffColor} />
              <Text style={[styles.badgeText, { color: diffColor }]}>
                {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: color + "20" }]}>
              <Ionicons name="flame" size={12} color={color} />
              <Text style={[styles.badgeText, { color }]}>{exercise.caloriesPerRep} kcal/rep</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: COLORS.blue + "20" }]}>
              <Ionicons name="time" size={12} color={COLORS.blue} />
              <Text style={[styles.badgeText, { color: COLORS.blue }]}>{exercise.repDuration}s/rep</Text>
            </View>
          </View>
        </Animated.View>

        {/* Target Muscles */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="body" size={18} color={color} />
            <Text style={styles.cardTitle}>Target Muscles</Text>
          </View>
          <View style={styles.muscleRow}>
            {exercise.targetMuscles.map((m) => (
              <View key={m} style={[styles.muscleChip, { backgroundColor: color + "15", borderColor: color + "30" }]}>
                <Text style={[styles.muscleText, { color }]}>{m}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Instructions */}
        <Animated.View entering={FadeInDown.delay(150).springify()} style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="list" size={18} color={color} />
            <Text style={styles.cardTitle}>How to Do It</Text>
          </View>
          {exercise.instructions.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={[styles.stepNum, { backgroundColor: color + "20" }]}>
                <Text style={[styles.stepNumText, { color }]}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Equipment & Variations */}
        <Animated.View entering={FadeInDown.delay(175).springify()} style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="construct" size={18} color={color} />
            <Text style={styles.cardTitle}>Equipment Needed</Text>
          </View>
          <View style={styles.muscleRow}>
            {exercise.equipment.map((eq) => (
              <View key={eq} style={[styles.muscleChip, { backgroundColor: COLORS.blue + "15", borderColor: COLORS.blue + "30" }]}>
                <Text style={[styles.muscleText, { color: COLORS.blue }]}>{eq === "none" ? "No Equipment" : eq.replace("_", " ")}</Text>
              </View>
            ))}
          </View>
          {exercise.variations.length > 0 && (
            <>
              <Text style={[styles.cardTitle, { marginTop: SPACING.md, fontSize: SIZES.sm, color: COLORS.textSecondary }]}>Variations</Text>
              <View style={[styles.muscleRow, { marginTop: SPACING.sm }]}>
                {exercise.variations.map((v) => (
                  <View key={v} style={[styles.muscleChip, { backgroundColor: color + "10", borderColor: color + "25" }]}>
                    <Text style={[styles.muscleText, { color }]}>{v}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsRow}>
          <View style={[styles.statCard, { borderColor: color + "30" }]}>
            <Ionicons name="flame-outline" size={20} color={COLORS.secondary} />
            <Text style={styles.statVal}>{exercise.caloriesPerRep}</Text>
            <Text style={styles.statLbl}>kcal/rep</Text>
          </View>
          <View style={[styles.statCard, { borderColor: color + "30" }]}>
            <Ionicons name="time-outline" size={20} color={COLORS.blue} />
            <Text style={styles.statVal}>{exercise.repDuration}s</Text>
            <Text style={styles.statLbl}>per rep</Text>
          </View>
          <View style={[styles.statCard, { borderColor: color + "30" }]}>
            <Ionicons name="trending-up-outline" size={20} color={COLORS.amber} />
            <Text style={styles.statVal}>{exercise.difficulty.charAt(0).toUpperCase()}</Text>
            <Text style={styles.statLbl}>Difficulty</Text>
          </View>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* CTA */}
      <Animated.View entering={FadeInUp.delay(300).springify()} style={[styles.ctaBar, { paddingBottom: insets.bottom + SPACING.base }]}>
        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: color, shadowColor: color }]}
          onPress={() =>
            router.push({
              pathname: "/exercise/live",
              params: { id: exercise.id, name: exercise.name, color },
            })
          }
          activeOpacity={0.85}
        >
          <Ionicons name="camera" size={20} color={COLORS.background} />
          <Text style={styles.ctaBtnText}>Start AI Workout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  backBtn: {
    width: 40, height: 40, alignItems: "center", justifyContent: "center",
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
  },
  headerTitle: { flex: 1, textAlign: "center", fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text },
  content: { paddingHorizontal: SPACING.xl },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    alignItems: "center",
    borderWidth: 1,
    marginBottom: SPACING.lg,
  },
  heroIcon: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.xl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },
  exerciseName: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.text, textAlign: "center" },
  exerciseDesc: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, textAlign: "center", marginTop: SPACING.sm, lineHeight: 20 },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm, marginTop: SPACING.md, justifyContent: "center" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  badgeText: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: SPACING.sm, marginBottom: SPACING.md },
  cardTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text },
  muscleRow: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  muscleChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  muscleText: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: SPACING.md, marginBottom: SPACING.sm },
  stepNum: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  stepNumText: { fontFamily: FONTS.bold, fontSize: SIZES.sm },
  stepText: { flex: 1, fontFamily: FONTS.regular, fontSize: SIZES.base, color: COLORS.text, lineHeight: 22, paddingTop: 3 },
  statsRow: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.md },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.md, alignItems: "center", borderWidth: 1, gap: SPACING.xs,
  },
  statVal: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text },
  statLbl: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textSecondary, textAlign: "center" },
  ctaBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    borderRadius: RADIUS.xl,
    height: 56,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  ctaBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.background },
});
