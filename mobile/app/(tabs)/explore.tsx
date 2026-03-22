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
import {
  EXERCISES,
  ExerciseCategory,
  getCategoryColor,
  getCategoryIcon,
  getCategoryLabel,
  DifficultyLevel,
} from "@/constants/exercises";

const ALL_CATEGORIES: ExerciseCategory[] = [
  "gym",
  "freehand",
  "calisthenics",
  "martial_arts",
  "yoga",
  "cardio",
  "rehab",
];

const CATEGORY_SUBTITLES: Record<ExerciseCategory, string> = {
  gym: "Machines & weights",
  freehand: "No equipment needed",
  calisthenics: "Advanced bodyweight skills",
  martial_arts: "Boxing, MMA & Kickboxing",
  yoga: "Flexibility & mindfulness",
  cardio: "HIIT & conditioning",
  rehab: "Recovery & balance",
};

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner: COLORS.primary,
  intermediate: COLORS.amber,
  advanced: COLORS.secondary,
};

const MUSCLE_FILTERS = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Glutes", "Calves"];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = search.length > 1
    ? EXERCISES.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.muscle_groups.some(m => m.toLowerCase().includes(search.toLowerCase())) ||
        e.category.toLowerCase().includes(search.toLowerCase()) ||
        e.subcategory.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Find your perfect workout</Text>
        </Animated.View>

        {/* Search */}
        <Animated.View entering={FadeInDown.delay(80).springify()} style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises, muscles, categories..."
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
            {filtered.map((ex) => (
              <TouchableOpacity
                key={ex.id}
                style={styles.resultRow}
                onPress={() => router.push({ pathname: "/exercise/detail", params: { id: ex.id, category: ex.category } })}
              >
                <View style={[styles.resultIcon, { backgroundColor: getCategoryColor(ex.category) + "20" }]}>
                  <Ionicons name={getCategoryIcon(ex.category) as any} size={20} color={getCategoryColor(ex.category)} />
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{ex.name}</Text>
                  <Text style={styles.resultMeta}>{getCategoryLabel(ex.category)} • {ex.muscle_groups[0]}</Text>
                </View>
                <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_COLORS[ex.difficulty] + "20" }]}>
                  <Text style={[styles.diffText, { color: DIFFICULTY_COLORS[ex.difficulty] }]}>{ex.difficulty}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* Categories Grid */}
        {search.length === 0 && (
          <>
            <Text style={styles.sectionTitle}>All Categories</Text>
            <View style={styles.categoriesGrid}>
              {ALL_CATEGORIES.map((cat, i) => {
                const count = EXERCISES.filter(e => e.category === cat).length;
                const color = getCategoryColor(cat);
                return (
                  <Animated.View key={cat} entering={FadeInDown.delay(i * 60 + 150).springify()} style={styles.catCardWrapper}>
                    <TouchableOpacity
                      style={[styles.catCard, { borderColor: color + "35" }]}
                      onPress={() => router.push({ pathname: "/exercise/[category]", params: { category: cat } })}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.catIconBg, { backgroundColor: color + "20" }]}>
                        <Ionicons name={getCategoryIcon(cat) as any} size={26} color={color} />
                      </View>
                      <Text style={[styles.catLabel, { color }]}>{getCategoryLabel(cat)}</Text>
                      <Text style={styles.catSub}>{CATEGORY_SUBTITLES[cat]}</Text>
                      <View style={[styles.catCountBadge, { backgroundColor: color + "15" }]}>
                        <Text style={[styles.catCount, { color }]}>{count}</Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>

            {/* Muscle Filter */}
            <Animated.View entering={FadeInDown.delay(600).springify()}>
              <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>Browse by Muscle</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.muscleRow}>
                  {MUSCLE_FILTERS.map((m) => (
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
            </Animated.View>

            {/* Equipment Tags */}
            <Animated.View entering={FadeInDown.delay(700).springify()}>
              <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>Browse by Equipment</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.muscleRow}>
                  {["No Equipment", "Dumbbell", "Barbell", "Machine", "Cable", "Mat"].map((eq) => (
                    <TouchableOpacity
                      key={eq}
                      style={[styles.muscleChip, { backgroundColor: COLORS.secondary + "15", borderColor: COLORS.secondary + "30" }]}
                      onPress={() => setSearch(eq)}
                    >
                      <Text style={[styles.muscleChipText, { color: COLORS.secondary }]}>{eq}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </Animated.View>
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
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  catCardWrapper: { width: "48.5%" },
  catCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    alignItems: "flex-start",
    gap: SPACING.xs,
  },
  catIconBg: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xs,
  },
  catLabel: { fontFamily: FONTS.bold, fontSize: SIZES.base },
  catSub: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textMuted, lineHeight: 16 },
  catCountBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginTop: SPACING.xs,
  },
  catCount: { fontFamily: FONTS.bold, fontSize: SIZES.xs },
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
