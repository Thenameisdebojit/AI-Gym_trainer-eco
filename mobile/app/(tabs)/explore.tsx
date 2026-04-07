import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { COLORS, FONTS, SIZES, RADIUS, SPACING } from "@/constants/theme";
import { useTranslation } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";
import {
  EXERCISES,
  ExerciseCategory,
  getCategoryColor,
  getCategoryIcon,
  getCategoryLabel,
} from "@/constants/exercises";

const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  "gym",
  "freehand",
  "calisthenics",
  "cardio",
  "yoga",
  "martial_arts",
  "rehab",
];

const CAT_IMAGES: Record<ExerciseCategory, string> = {
  gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  freehand: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  calisthenics: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80",
  cardio: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
  yoga: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
  martial_arts: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&q=80",
  rehab: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
};

const DIFF_COLORS = {
  beginner: "#10B981",
  intermediate: "#F59E0B",
  advanced: "#EF4444",
};

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { t } = useTranslation();
  const { language } = useApp();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    EXERCISES.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }, []);

  const sampleExercises = useMemo(() => {
    const picks: typeof EXERCISES = [];
    EXERCISE_CATEGORIES.forEach(cat => {
      const found = EXERCISES.find(e => e.category === cat);
      if (found) picks.push(found);
    });
    return picks.slice(0, 7);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>{t("discover")}</Text>
            <Text style={styles.subtitle}>{t("findPerfectWorkout")}</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => router.push("/search")}
              activeOpacity={0.75}
            >
              <Ionicons name="search-outline" size={22} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => router.push("/workout/history")}
              activeOpacity={0.75}
            >
              <Ionicons name="time-outline" size={22} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── Hero stat banner ── */}
        <Animated.View entering={FadeInDown.delay(40).springify()}>
          <TouchableOpacity
            style={styles.heroBanner}
            onPress={() => router.push("/search")}
            activeOpacity={0.88}
          >
            <View style={styles.heroLeft}>
              <Text style={styles.heroCount}>{EXERCISES.length}</Text>
              <Text style={styles.heroLabel}>Exercises Available</Text>
              <Text style={styles.heroSub}>{EXERCISE_CATEGORIES.length} categories · All levels</Text>
            </View>
            <View style={styles.heroRight}>
              <Ionicons name="barbell-outline" size={48} color={COLORS.primary + "60"} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Browse by Category ── */}
        <Animated.View entering={FadeInDown.delay(120).springify()} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <TouchableOpacity onPress={() => router.push("/search")} activeOpacity={0.7}>
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.catGrid}>
          {EXERCISE_CATEGORIES.map((cat, i) => {
            const color = getCategoryColor(cat);
            const icon = getCategoryIcon(cat);
            const label = getCategoryLabel(cat);
            const count = categoryCounts[cat] || 0;
            return (
              <Animated.View
                key={cat}
                entering={FadeInDown.delay(160 + i * 50).springify()}
                style={styles.catCardWrap}
              >
                <TouchableOpacity
                  style={styles.catCard}
                  onPress={() => router.push({ pathname: "/exercise/[category]", params: { category: cat } })}
                  activeOpacity={0.85}
                >
                  <Image
                    source={{ uri: CAT_IMAGES[cat] }}
                    style={styles.catImg}
                    resizeMode="cover"
                  />
                  <View style={styles.catOverlay} />
                  <View style={[styles.catGradient, { backgroundColor: color + "99" }]} />
                  <View style={[styles.catIconBadge, { backgroundColor: color + "CC" }]}>
                    <Ionicons name={icon as any} size={18} color="#fff" />
                  </View>
                  <View style={styles.catCountBadge}>
                    <Text style={styles.catCountText}>{count}</Text>
                  </View>
                  <View style={styles.catInfo}>
                    <Text style={styles.catLabel}>{label}</Text>
                    <Text style={styles.catCountSub}>{count} exercises</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* ── Sample Exercises ── */}
        <Animated.View entering={FadeInDown.delay(520).springify()} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sample Exercises</Text>
          <TouchableOpacity onPress={() => router.push("/search")} activeOpacity={0.7}>
            <Text style={styles.seeAll}>Browse all →</Text>
          </TouchableOpacity>
        </Animated.View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -SPACING.xl, marginBottom: SPACING.xl }}
          contentContainerStyle={{ paddingHorizontal: SPACING.xl, gap: SPACING.md }}
        >
          {sampleExercises.map((ex, i) => {
            const color = getCategoryColor(ex.category);
            const icon = getCategoryIcon(ex.category);
            return (
              <Animated.View key={ex.id} entering={FadeInRight.delay(560 + i * 60).springify()}>
                <TouchableOpacity
                  style={[styles.sampleCard, { borderColor: color + "30" }]}
                  onPress={() => router.push({ pathname: "/exercise/[category]", params: { category: ex.category } })}
                  activeOpacity={0.85}
                >
                  <View style={[styles.sampleIcon, { backgroundColor: color + "20" }]}>
                    <Ionicons name={icon as any} size={26} color={color} />
                  </View>
                  <Text style={styles.sampleName} numberOfLines={2}>{ex.name}</Text>
                  <Text style={styles.sampleMuscle} numberOfLines={1}>
                    {ex.muscle_groups[0]}
                  </Text>
                  <View style={[styles.sampleDiffPill, { backgroundColor: DIFF_COLORS[ex.difficulty] + "20" }]}>
                    <Text style={[styles.sampleDiffText, { color: DIFF_COLORS[ex.difficulty] }]}>
                      {ex.difficulty.charAt(0).toUpperCase() + ex.difficulty.slice(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>

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
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
  },
  headerLeft: { flex: 1 },
  title: { fontFamily: FONTS.bold, fontSize: SIZES.xxxl, color: COLORS.text },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  headerIcons: { flexDirection: "row", gap: SPACING.sm, marginTop: 6 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  heroBanner: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  heroLeft: { flex: 1 },
  heroCount: {
    fontFamily: FONTS.bold,
    fontSize: 48,
    color: COLORS.primary,
    lineHeight: 52,
  },
  heroLabel: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.lg,
    color: COLORS.text,
    marginTop: 2,
  },
  heroSub: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  heroRight: { paddingLeft: SPACING.lg },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.lg,
    color: COLORS.text,
  },
  seeAll: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.sm,
    color: COLORS.primary,
  },

  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  catCardWrap: { width: "48.5%" },
  catCard: {
    height: 130,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
    justifyContent: "flex-end",
  },
  catImg: { position: "absolute", width: "100%", height: "100%" },
  catOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  catGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  catIconBadge: {
    position: "absolute",
    top: SPACING.sm,
    left: SPACING.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  catCountBadge: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  catCountText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xs,
    color: "#fff",
  },
  catInfo: {
    padding: SPACING.md,
  },
  catLabel: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.base,
    color: "#fff",
  },
  catCountSub: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },

  sampleCard: {
    width: 150,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  sampleIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xs,
  },
  sampleName: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.sm,
    color: COLORS.text,
    lineHeight: 18,
  },
  sampleMuscle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
  },
  sampleDiffPill: {
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginTop: SPACING.xs,
  },
  sampleDiffText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.xs,
  },
});
