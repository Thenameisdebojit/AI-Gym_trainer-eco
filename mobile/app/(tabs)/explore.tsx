import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS, FONTS, SIZES, RADIUS, SPACING } from "@/constants/theme";
import { EXERCISES, ExerciseCategory, getCategoryColor } from "@/constants/exercises";

const CATEGORIES = [
  {
    id: "freehand" as ExerciseCategory,
    label: "Freehand",
    subtitle: "No equipment needed",
    icon: "body-outline",
    color: COLORS.primary,
    count: EXERCISES.filter(e => e.category === "freehand").length,
  },
  {
    id: "gym" as ExerciseCategory,
    label: "Gym",
    subtitle: "Machine & weights",
    icon: "barbell-outline",
    color: COLORS.secondary,
    count: EXERCISES.filter(e => e.category === "gym").length,
  },
  {
    id: "calisthenics" as ExerciseCategory,
    label: "Calisthenics",
    subtitle: "Advanced bodyweight",
    icon: "fitness-outline",
    color: COLORS.purple,
    count: EXERCISES.filter(e => e.category === "calisthenics").length,
  },
];

const DIFFICULTY_COLORS = {
  beginner: COLORS.primary,
  intermediate: COLORS.amber,
  advanced: COLORS.secondary,
};

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = search.length > 1
    ? EXERCISES.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.targetMuscles.some(m => m.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Find your perfect workout</Text>
        </Animated.View>

        {/* Search */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises or muscles..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Search Results */}
        {filtered.length > 0 && (
          <Animated.View entering={FadeInDown.springify()}>
            <Text style={styles.sectionTitle}>Results ({filtered.length})</Text>
            {filtered.map((ex, i) => (
              <TouchableOpacity
                key={ex.id}
                style={styles.resultRow}
                onPress={() => router.push({ pathname: "/exercise/detail", params: { id: ex.id, category: ex.category } })}
              >
                <View style={[styles.resultIcon, { backgroundColor: getCategoryColor(ex.category) + "20" }]}>
                  <Ionicons name={ex.icon as any} size={20} color={getCategoryColor(ex.category)} />
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{ex.name}</Text>
                  <Text style={styles.resultMeta}>{ex.subcategory} • {ex.targetMuscles[0]}</Text>
                </View>
                <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_COLORS[ex.difficulty] + "20" }]}>
                  <Text style={[styles.diffText, { color: DIFFICULTY_COLORS[ex.difficulty] }]}>{ex.difficulty}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* Categories */}
        {search.length === 0 && (
          <>
            <Text style={styles.sectionTitle}>Categories</Text>
            {CATEGORIES.map((cat, i) => (
              <Animated.View key={cat.id} entering={FadeInDown.delay(i * 100 + 200).springify()}>
                <TouchableOpacity
                  style={[styles.categoryCard, { borderColor: cat.color + "30" }]}
                  onPress={() => router.push({ pathname: "/exercise/[category]", params: { category: cat.id } })}
                  activeOpacity={0.8}
                >
                  <View style={[styles.catIconBg, { backgroundColor: cat.color + "20" }]}>
                    <Ionicons name={cat.icon as any} size={32} color={cat.color} />
                  </View>
                  <View style={styles.catInfo}>
                    <Text style={styles.catLabel}>{cat.label}</Text>
                    <Text style={styles.catSubtitle}>{cat.subtitle}</Text>
                    <View style={styles.catBadge}>
                      <Text style={[styles.catCount, { color: cat.color }]}>{cat.count} exercises</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={cat.color} />
                </TouchableOpacity>
              </Animated.View>
            ))}

            {/* Muscles Featured */}
            <Text style={[styles.sectionTitle, { marginTop: SPACING.lg }]}>Target Muscles</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.muscleRow}>
                {["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Glutes"].map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={styles.muscleChip}
                    onPress={() => setSearch(m)}
                  >
                    <Text style={styles.muscleChipText}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </>
        )}

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
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
    height: 48,
  },
  searchIcon: { marginRight: SPACING.sm },
  searchInput: { flex: 1, fontFamily: FONTS.regular, fontSize: SIZES.base, color: COLORS.text },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text, marginBottom: SPACING.md },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    gap: SPACING.base,
  },
  catIconBg: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  catInfo: { flex: 1 },
  catLabel: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text },
  catSubtitle: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  catBadge: { marginTop: SPACING.xs },
  catCount: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  resultIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  resultInfo: { flex: 1 },
  resultName: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.text },
  resultMeta: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  diffBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full },
  diffText: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs },
  muscleRow: { flexDirection: "row", gap: SPACING.sm, paddingBottom: SPACING.md },
  muscleChip: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  muscleChipText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.textSecondary },
});
