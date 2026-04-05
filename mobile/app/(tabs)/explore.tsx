import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
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
} from "@/constants/exercises";
import { useTranslation } from "@/context/LanguageContext";

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

const MUSCLE_FILTERS = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Glutes", "Calves"];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header with icons */}
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>{t("discover")}</Text>
            <Text style={styles.subtitle}>{t("findPerfectWorkout")}</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => router.push("/search")}
              activeOpacity={0.8}
            >
              <Ionicons name="search-outline" size={22} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => router.push("/workout/history")}
              activeOpacity={0.8}
            >
              <Ionicons name="time-outline" size={22} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Quick search tap target */}
        <Animated.View entering={FadeInDown.delay(60).springify()}>
          <TouchableOpacity
            style={styles.searchTapArea}
            onPress={() => router.push("/search")}
            activeOpacity={0.8}
          >
            <Ionicons name="search-outline" size={16} color={COLORS.textMuted} />
            <Text style={styles.searchPlaceholder}>{t("searchExercises")}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Categories Grid */}
        <Text style={styles.sectionTitle}>{t("allCategories")}</Text>
        <View style={styles.categoriesGrid}>
          {ALL_CATEGORIES.map((cat, i) => {
            const count = EXERCISES.filter((e) => e.category === cat).length;
            const color = getCategoryColor(cat);
            return (
              <Animated.View key={cat} entering={FadeInDown.delay(i * 60 + 120).springify()} style={styles.catCardWrapper}>
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
        <Animated.View entering={FadeInDown.delay(580).springify()}>
          <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>{t("browseByMuscle")}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.muscleRow}>
              {MUSCLE_FILTERS.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={styles.muscleChip}
                  onPress={() => router.push({ pathname: "/search", params: { q: m } })}
                >
                  <Text style={styles.muscleChipText}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Equipment Tags */}
        <Animated.View entering={FadeInDown.delay(660).springify()}>
          <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>{t("browseByEquipment")}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.muscleRow}>
              {["No Equipment", "Dumbbell", "Barbell", "Machine", "Cable", "Mat"].map((eq) => (
                <TouchableOpacity
                  key={eq}
                  style={[styles.muscleChip, { backgroundColor: COLORS.secondary + "15", borderColor: COLORS.secondary + "30" }]}
                  onPress={() => router.push({ pathname: "/search", params: { q: eq } })}
                >
                  <Text style={[styles.muscleChipText, { color: COLORS.secondary }]}>{eq}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        <View style={{ height: SPACING.xxxl + 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING.xl },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  headerLeft: { flex: 1 },
  title: { fontFamily: FONTS.bold, fontSize: SIZES.xxxl, color: COLORS.text },
  subtitle: { fontFamily: FONTS.regular, fontSize: SIZES.md, color: COLORS.textSecondary, marginTop: 4 },

  headerIcons: { flexDirection: "row", gap: SPACING.sm, marginTop: 4 },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  searchTapArea: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
    height: 46,
    gap: SPACING.sm,
  },
  searchPlaceholder: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.base,
    color: COLORS.textMuted,
  },

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
