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
import { EXERCISES, ExerciseCategory, getCategoryColor } from "@/constants/exercises";

const FEATURED = [
  { id: "pushup_normal", label: "Push-up", category: "freehand" as ExerciseCategory, icon: "fitness-outline", color: COLORS.secondary },
  { id: "squat_bodyweight", label: "Squat", category: "freehand" as ExerciseCategory, icon: "body-outline", color: COLORS.primary },
  { id: "pullup", label: "Pull-up", category: "calisthenics" as ExerciseCategory, icon: "barbell-outline", color: COLORS.purple },
  { id: "bench_press", label: "Bench Press", category: "gym" as ExerciseCategory, icon: "barbell-outline", color: COLORS.secondary },
  { id: "crunch", label: "Crunch", category: "freehand" as ExerciseCategory, icon: "body-outline", color: COLORS.amber },
  { id: "dips", label: "Dips", category: "calisthenics" as ExerciseCategory, icon: "fitness-outline", color: COLORS.purple },
];

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
          <Text style={styles.title}>Workout</Text>
          <Text style={styles.subtitle}>Select an exercise to begin</Text>
        </Animated.View>

        {/* Start AI Session */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View style={styles.aiBanner}>
            <View style={styles.aiBannerLeft}>
              <View style={styles.aiIconBg}>
                <Ionicons name="camera" size={24} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.aiBannerTitle}>AI Live Trainer</Text>
                <Text style={styles.aiBannerSub}>Camera-powered rep counting</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.aiBtn}
              onPress={() => router.push({ pathname: "/exercise/detail", params: { id: "pushup_normal", category: "freehand" } })}
            >
              <Ionicons name="play" size={16} color={COLORS.background} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Featured */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Text style={styles.sectionTitle}>Featured Exercises</Text>
        </Animated.View>
        <View style={styles.featuredGrid}>
          {FEATURED.map((item, i) => (
            <Animated.View key={item.id} entering={FadeInDown.delay(i * 60 + 250).springify()} style={styles.featuredWrapper}>
              <TouchableOpacity
                style={[styles.featuredCard, { borderColor: item.color + "30" }]}
                onPress={() => router.push({ pathname: "/exercise/detail", params: { id: item.id, category: item.category } })}
                activeOpacity={0.75}
              >
                <View style={[styles.featuredIcon, { backgroundColor: item.color + "20" }]}>
                  <Ionicons name={item.icon as any} size={28} color={item.color} />
                </View>
                <Text style={styles.featuredName}>{item.label}</Text>
                <View style={[styles.startBtn, { backgroundColor: item.color }]}>
                  <Ionicons name="play" size={12} color={COLORS.background} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Browse by Category */}
        <Animated.View entering={FadeInDown.delay(600).springify()}>
          <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>Browse by Category</Text>
          {(["freehand", "gym", "calisthenics"] as ExerciseCategory[]).map((cat, i) => {
            const count = EXERCISES.filter(e => e.category === cat).length;
            const color = getCategoryColor(cat);
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryRow, { borderColor: color + "30" }]}
                onPress={() => router.push({ pathname: "/exercise/[category]", params: { category: cat } })}
                activeOpacity={0.8}
              >
                <View style={[styles.catIcon, { backgroundColor: color + "20" }]}>
                  <Ionicons
                    name={cat === "gym" ? "barbell-outline" : cat === "calisthenics" ? "fitness-outline" : "body-outline"}
                    size={24}
                    color={color}
                  />
                </View>
                <View style={styles.catInfo}>
                  <Text style={styles.catName}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
                  <Text style={styles.catCount}>{count} exercises</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={color} />
              </TouchableOpacity>
            );
          })}
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
  aiBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primaryDim,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
  },
  aiBannerLeft: { flexDirection: "row", alignItems: "center", gap: SPACING.md, flex: 1 },
  aiIconBg: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary + "25",
    alignItems: "center",
    justifyContent: "center",
  },
  aiBannerTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text },
  aiBannerSub: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  aiBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text, marginBottom: SPACING.md },
  featuredGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm, marginBottom: SPACING.md },
  featuredWrapper: { width: "48.5%" },
  featuredCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  featuredIcon: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  featuredName: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.text, flex: 1 },
  startBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    gap: SPACING.md,
  },
  catIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  catInfo: { flex: 1 },
  catName: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.text },
  catCount: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
});
