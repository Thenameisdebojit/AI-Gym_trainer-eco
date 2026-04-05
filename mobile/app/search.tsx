import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { COLORS, FONTS, SIZES, RADIUS, SPACING } from "@/constants/theme";
import {
  EXERCISES,
  getCategoryColor,
  getCategoryIcon,
  getCategoryLabel,
  DifficultyLevel,
} from "@/constants/exercises";
import { BODY_FOCUS_CATEGORIES } from "@/utils/getCategoryImage";
import { useTranslation } from "@/context/LanguageContext";

const WORKOUT_TYPES = [
  { key: "muscle", label: "Build Muscle", icon: "💪" },
  { key: "warmup", label: "Warm-Up", icon: "🏃" },
  { key: "fat", label: "Fat Burning", icon: "🔥" },
  { key: "equipment", label: "With Equipment", icon: "🏋️" },
  { key: "stretching", label: "Stretching", icon: "🧘" },
  { key: "cardio", label: "Cardio", icon: "❤️" },
];

const LEVELS: DifficultyLevel[] = ["beginner", "intermediate", "advanced"];
const LEVEL_COLORS: Record<DifficultyLevel, string> = {
  beginner: "#5B8DEF",
  intermediate: "#F59E0B",
  advanced: "#EF5B5B",
};

const DURATIONS = [
  { key: "short", label: "< 4\nmins" },
  { key: "medium", label: "5–7\nmins" },
  { key: "long", label: "8–10\nmins" },
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { t } = useTranslation();
  const inputRef = useRef<TextInput>(null);

  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(params.q ?? "");
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedBody, setSelectedBody] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!params.q) inputRef.current?.focus();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const filtered = EXERCISES.filter((ex) => {
    const q = query.toLowerCase();
    const matchesQuery =
      q.length < 2 ||
      ex.name.toLowerCase().includes(q) ||
      ex.muscle_groups.some((m) => m.toLowerCase().includes(q)) ||
      ex.category.toLowerCase().includes(q) ||
      ex.subcategory.toLowerCase().includes(q);

    const matchesLevel = !selectedLevel || ex.difficulty === selectedLevel;

    const matchesBody =
      !selectedBody ||
      ex.muscle_groups.some((m) => m.toLowerCase().includes(selectedBody.toLowerCase())) ||
      ex.category.toLowerCase().includes(selectedBody.toLowerCase()) ||
      ex.subcategory.toLowerCase().includes(selectedBody.toLowerCase()) ||
      selectedBody === "fullbody";

    const matchesType =
      !selectedType ||
      (selectedType === "muscle" && (ex.category === "gym" || ex.subcategory.toLowerCase().includes("strength"))) ||
      (selectedType === "fat" && ex.subcategory.toLowerCase().includes("hiit")) ||
      (selectedType === "cardio" && ex.category === "cardio") ||
      (selectedType === "equipment" && ex.category === "gym") ||
      (selectedType === "warmup" && ex.subcategory.toLowerCase().includes("warm")) ||
      (selectedType === "stretching" && (ex.category === "yoga" || ex.category === "rehab"));

    return matchesQuery && matchesLevel && matchesBody && matchesType;
  });

  const showResults = query.length > 1 || selectedLevel || selectedType || selectedBody || selectedDuration;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* Search Bar */}
      <Animated.View entering={FadeIn.duration(200)} style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={{ marginLeft: 4 }} />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Search workouts, plans..."
          placeholderTextColor={COLORS.textMuted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>{t("cancel")}</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Body Focus - circular images */}
        <Animated.View entering={FadeInDown.delay(40).springify()}>
          <Text style={styles.sectionTitle}>{t("bodyFocus")}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.bodyRow}>
              {BODY_FOCUS_CATEGORIES.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={styles.bodyItem}
                  onPress={() => setSelectedBody(selectedBody === item.key ? null : item.key)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.bodyCircle,
                      selectedBody === item.key && styles.bodyCircleActive,
                    ]}
                  >
                    <Image source={{ uri: item.image }} style={styles.bodyCircleImg} resizeMode="cover" />
                    {selectedBody === item.key && (
                      <View style={styles.bodyCircleOverlay}>
                        <Ionicons name="checkmark" size={22} color="#fff" />
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.bodyLabel,
                      selectedBody === item.key && { color: COLORS.primary },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Workout Type */}
        <Animated.View entering={FadeInDown.delay(80).springify()}>
          <Text style={styles.sectionTitle}>{t("workoutType")}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.typeRow}>
              {WORKOUT_TYPES.map((wt) => (
                <TouchableOpacity
                  key={wt.key}
                  style={[
                    styles.typeCard,
                    selectedType === wt.key && styles.typeCardActive,
                  ]}
                  onPress={() => setSelectedType(selectedType === wt.key ? null : wt.key)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.typeIcon}>{wt.icon}</Text>
                  <Text
                    style={[
                      styles.typeLabel,
                      selectedType === wt.key && { color: COLORS.text },
                    ]}
                  >
                    {wt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Level Filter */}
        <Animated.View entering={FadeInDown.delay(120).springify()}>
          <Text style={styles.sectionTitle}>{t("level")}</Text>
          <View style={styles.levelRow}>
            {LEVELS.map((lvl) => (
              <TouchableOpacity
                key={lvl}
                style={[
                  styles.levelChip,
                  { borderColor: LEVEL_COLORS[lvl] + "60" },
                  selectedLevel === lvl && {
                    backgroundColor: LEVEL_COLORS[lvl] + "20",
                    borderColor: LEVEL_COLORS[lvl],
                  },
                ]}
                onPress={() => setSelectedLevel(selectedLevel === lvl ? null : lvl)}
              >
                <Text
                  style={[
                    styles.levelText,
                    { color: LEVEL_COLORS[lvl] },
                  ]}
                >
                  {t(lvl)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Duration Filter */}
        <Animated.View entering={FadeInDown.delay(160).springify()}>
          <Text style={styles.sectionTitle}>{t("duration")}</Text>
          <View style={styles.durationRow}>
            {DURATIONS.map((d) => (
              <TouchableOpacity
                key={d.key}
                style={[
                  styles.durationCard,
                  selectedDuration === d.key && styles.durationCardActive,
                ]}
                onPress={() => setSelectedDuration(selectedDuration === d.key ? null : d.key)}
              >
                <Text
                  style={[
                    styles.durationText,
                    selectedDuration === d.key && { color: COLORS.primary },
                  ]}
                >
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Can't find / tell us */}
        {!showResults && (
          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.tellUs}>
            <Text style={styles.tellUsText}>Can't find what you want?</Text>
            <TouchableOpacity style={styles.tellUsBtn}>
              <Ionicons name="pencil-outline" size={14} color={COLORS.primary} />
              <Text style={styles.tellUsBtnText}>Tell us what you need</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Search Results */}
        {showResults && (
          <Animated.View entering={FadeInDown.springify()} style={{ marginTop: SPACING.md }}>
            <Text style={styles.sectionTitle}>
              {t("results")} ({filtered.length})
            </Text>
            {filtered.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color={COLORS.textMuted} />
                <Text style={styles.emptyText}>No results found</Text>
                <Text style={styles.emptySubText}>Try adjusting your filters</Text>
              </View>
            ) : (
              filtered.slice(0, 30).map((ex, i) => (
                <Animated.View key={ex.id} entering={FadeInDown.delay(i * 25).springify()}>
                  <TouchableOpacity
                    style={styles.resultRow}
                    onPress={() =>
                      router.push({ pathname: "/exercise/detail", params: { id: ex.id, category: ex.category } })
                    }
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.resultIcon,
                        { backgroundColor: getCategoryColor(ex.category) + "20" },
                      ]}
                    >
                      <Ionicons
                        name={getCategoryIcon(ex.category) as any}
                        size={20}
                        color={getCategoryColor(ex.category)}
                      />
                    </View>
                    <View style={styles.resultInfo}>
                      <Text style={styles.resultName}>{ex.name}</Text>
                      <Text style={styles.resultMeta}>
                        {getCategoryLabel(ex.category)} · {ex.muscle_groups[0]}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.diffBadge,
                        { backgroundColor: LEVEL_COLORS[ex.difficulty] + "20" },
                      ]}
                    >
                      <Text style={[styles.diffText, { color: LEVEL_COLORS[ex.difficulty] }]}>
                        {ex.difficulty}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))
            )}
          </Animated.View>
        )}

        <View style={{ height: SPACING.xxxl + 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: SIZES.base,
    color: COLORS.text,
    height: 42,
    paddingVertical: 0,
  },
  clearBtn: { padding: 4 },
  cancelBtn: { paddingHorizontal: SPACING.sm, paddingVertical: 4 },
  cancelText: { fontFamily: FONTS.medium, fontSize: SIZES.base, color: COLORS.primary },

  content: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg },

  sectionTitle: {
    fontFamily: FONTS.bold, fontSize: SIZES.lg,
    color: COLORS.text, marginBottom: SPACING.md,
  },

  /* Body Focus - Circular */
  bodyRow: {
    flexDirection: "row",
    gap: SPACING.lg,
    paddingBottom: SPACING.md,
    paddingRight: SPACING.xl,
  },
  bodyItem: { alignItems: "center", gap: SPACING.sm, width: 76 },
  bodyCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  bodyCircleActive: { borderColor: COLORS.primary },
  bodyCircleImg: { width: "100%", height: "100%" },
  bodyCircleOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,255,136,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  bodyLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  /* Workout Type */
  typeRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    paddingBottom: SPACING.md,
    flexWrap: "wrap",
  },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: "45%",
    marginBottom: SPACING.xs,
  },
  typeCardActive: {
    backgroundColor: COLORS.primaryDim,
    borderColor: COLORS.primary,
  },
  typeIcon: { fontSize: 20 },
  typeLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },

  /* Level chips */
  levelRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  levelChip: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    backgroundColor: COLORS.surface,
    alignItems: "center",
  },
  levelText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.sm,
  },

  /* Duration */
  durationRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  durationCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.base,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 70,
  },
  durationCardActive: {
    backgroundColor: COLORS.primaryDim,
    borderColor: COLORS.primary,
  },
  durationText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  /* Tell us */
  tellUs: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
    gap: SPACING.sm,
  },
  tellUsText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
  },
  tellUsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    backgroundColor: COLORS.primaryDim,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary + "40",
  },
  tellUsBtnText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.sm,
    color: COLORS.primary,
  },

  /* Results */
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
    width: 44, height: 44, borderRadius: RADIUS.md,
    alignItems: "center", justifyContent: "center",
  },
  resultInfo: { flex: 1 },
  resultName: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.text },
  resultMeta: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  diffBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full },
  diffText: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs },

  emptyState: { alignItems: "center", paddingVertical: SPACING.xxxl, gap: SPACING.md },
  emptyText: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text },
  emptySubText: { fontFamily: FONTS.regular, fontSize: SIZES.base, color: COLORS.textSecondary },
});
