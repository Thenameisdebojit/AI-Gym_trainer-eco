import React, { useState } from "react";
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
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS, FONTS, SIZES, RADIUS, SPACING } from "@/constants/theme";
import {
  ExerciseCategory,
  getExercisesByCategory,
  getCategoryColor,
  getCategoryIcon,
  getCategoryLabel,
  DifficultyLevel,
} from "@/constants/exercises";

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner: COLORS.primary,
  intermediate: COLORS.amber,
  advanced: COLORS.secondary,
};

export default function CategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const insets = useSafeAreaInsets();
  const [selectedDiff, setSelectedDiff] = useState<DifficultyLevel | "all">("all");

  const cat = category as ExerciseCategory;
  const color = getCategoryColor(cat);
  const icon = getCategoryIcon(cat);
  const groups = getExercisesByCategory(cat);
  const label = getCategoryLabel(cat);
  const totalCount = groups.reduce((a, g) => a + g.exercises.length, 0);

  const filteredGroups = groups
    .map(g => ({
      ...g,
      exercises: g.exercises.filter(e => selectedDiff === "all" || e.difficulty === selectedDiff),
    }))
    .filter(g => g.exercises.length > 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(0).springify()} style={[styles.header, { borderBottomColor: color + "20" }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerTitleRow}>
            <Ionicons name={icon as any} size={20} color={color} />
            <Text style={[styles.headerTitle, { color }]}>{label}</Text>
          </View>
          <Text style={styles.headerSub}>{totalCount} exercises</Text>
        </View>
        <View style={{ width: 40 }} />
      </Animated.View>

      {/* Difficulty Filter */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {(["all", "beginner", "intermediate", "advanced"] as const).map(diff => (
            <TouchableOpacity
              key={diff}
              style={[
                styles.filterBtn,
                selectedDiff === diff && {
                  backgroundColor: diff === "all" ? color : DIFFICULTY_COLORS[diff as DifficultyLevel],
                  borderColor: diff === "all" ? color : DIFFICULTY_COLORS[diff as DifficultyLevel],
                },
              ]}
              onPress={() => setSelectedDiff(diff)}
            >
              <Text style={[
                styles.filterText,
                selectedDiff === diff && { color: COLORS.background },
              ]}>
                {diff === "all" ? "All" : diff.charAt(0).toUpperCase() + diff.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {filteredGroups.length === 0 ? (
          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.emptyState}>
            <Ionicons name={icon as any} size={48} color={color + "40"} />
            <Text style={styles.emptyText}>No {selectedDiff} exercises yet</Text>
          </Animated.View>
        ) : (
          filteredGroups.map((group, gi) => (
            <Animated.View key={group.subcategory} entering={FadeInDown.delay(gi * 80 + 200).springify()}>
              <View style={styles.groupHeader}>
                <View style={[styles.groupDot, { backgroundColor: color }]} />
                <Text style={styles.groupTitle}>{group.subcategory}</Text>
                <Text style={styles.groupCount}>{group.exercises.length}</Text>
              </View>
              <View style={styles.groupCards}>
                {group.exercises.map((ex) => (
                  <TouchableOpacity
                    key={ex.id}
                    style={[styles.exerciseCard, { borderColor: color + "20" }]}
                    onPress={() => router.push({ pathname: "/exercise/detail", params: { id: ex.id, category: cat } })}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.exIcon, { backgroundColor: color + "20" }]}>
                      <Ionicons name={ex.icon as any} size={22} color={color} />
                    </View>
                    <View style={styles.exInfo}>
                      <Text style={styles.exName}>{ex.name}</Text>
                      <Text style={styles.exMuscles}>{ex.muscle_groups.slice(0, 2).join(" • ")}</Text>
                      {ex.equipment.filter(e => e !== "none" && e !== "mat").length > 0 && (
                        <Text style={styles.exEquip}>
                          {ex.equipment.filter(e => e !== "none" && e !== "mat").slice(0, 2).join(", ")}
                        </Text>
                      )}
                    </View>
                    <View style={styles.exRight}>
                      <View style={[styles.diffPill, { backgroundColor: DIFFICULTY_COLORS[ex.difficulty] + "20" }]}>
                        <Text style={[styles.diffPillText, { color: DIFFICULTY_COLORS[ex.difficulty] }]}>
                          {ex.difficulty.charAt(0).toUpperCase() + ex.difficulty.slice(1)}
                        </Text>
                      </View>
                      {ex.is_compound && (
                        <View style={styles.compoundBadge}>
                          <Text style={styles.compoundText}>compound</Text>
                        </View>
                      )}
                      <Ionicons name="chevron-forward" size={16} color={color} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          ))
        )}
        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
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
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40, height: 40, alignItems: "center", justifyContent: "center",
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitleRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  headerTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xl },
  headerSub: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  filterRow: {
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  filterBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  filterText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.textSecondary },
  content: { paddingHorizontal: SPACING.xl },
  emptyState: { alignItems: "center", paddingTop: SPACING.xxxl, gap: SPACING.md },
  emptyText: { fontFamily: FONTS.medium, fontSize: SIZES.base, color: COLORS.textSecondary },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  groupDot: { width: 6, height: 6, borderRadius: 3 },
  groupTitle: { flex: 1, fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.textSecondary, textTransform: "uppercase", letterSpacing: 0.5 },
  groupCount: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.textMuted },
  groupCards: { gap: SPACING.sm, marginBottom: SPACING.md },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1,
    gap: SPACING.md,
  },
  exIcon: {
    width: 48, height: 48, borderRadius: RADIUS.md,
    alignItems: "center", justifyContent: "center",
  },
  exInfo: { flex: 1, gap: 2 },
  exName: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.text },
  exMuscles: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary },
  exEquip: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textMuted, textTransform: "capitalize" },
  exRight: { alignItems: "flex-end", gap: SPACING.xs },
  diffPill: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.full },
  diffPillText: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs },
  compoundBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.blue + "15",
  },
  compoundText: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.blue },
});
