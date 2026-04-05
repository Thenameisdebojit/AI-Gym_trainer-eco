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
  { key: "muscle", label: "Build Muscle", icon: "barbell-outline", color: COLORS.primary },
  { key: "fat", label: "Fat Burning", icon: "flame-outline", color: COLORS.secondary },
  { key: "cardio", label: "Cardio", icon: "heart-outline", color: COLORS.blue },
  { key: "equipment", label: "Equipment", icon: "fitness-outline", color: COLORS.purple },
];

const LEVELS: DifficultyLevel[] = ["beginner", "intermediate", "advanced"];
const LEVEL_COLORS: Record<DifficultyLevel, string> = {
  beginner: COLORS.primary,
  intermediate: COLORS.amber,
  advanced: COLORS.secondary,
};

const DURATIONS = [
  { key: "short", label: "< 5 min" },
  { key: "medium", label: "5–10 min" },
  { key: "long", label: "10–20 min" },
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
      ex.subcategory.toLowerCase().includes(selectedBody.toLowerCase());

    const matchesType =
      !selectedType ||
      (selectedType === "muscle" && (ex.category === "gym" || ex.subcategory.toLowerCase().includes("strength"))) ||
      (selectedType === "fat" && ex.subcategory.toLowerCase().includes("hiit")) ||
      (selectedType === "cardio" && ex.category === "cardio") ||
      (selectedType === "equipment" && ex.category === "gym");

    return matchesQuery && matchesLevel && matchesBody && matchesType;
  });

  const showResults = query.length > 1 || selectedLevel || selectedType || selectedBody || selectedDuration;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* Search Bar */}
      <Animated.View entering={FadeIn.duration(200)} style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder={t("searchExercises")}
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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Body Focus */}
        {!showResults && (
          <Animated.View entering={FadeInDown.delay(50).springify()}>
            <Text style={styles.sectionTitle}>{t("bodyFocus")}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.bodyRow}>
                {BODY_FOCUS_CATEGORIES.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.bodyCard,
                      selectedBody === item.key && styles.bodyCardActive,
                    ]}
                    onPress={() => setSelectedBody(selectedBody === item.key ? null : item.key)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: item.image }} style={styles.bodyImage} resizeMode="cover" />
                    <View style={styles.bodyOverlay} />
                    <Text style={styles.bodyLabel}>{item.label}</Text>
                    {selectedBody === item.key && (
                      <View style={styles.bodyCheck}>
                        <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        )}

        {/* Workout Type */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Text style={styles.sectionTitle}>{t("workoutType")}</Text>
          <View style={styles.typeGrid}>
            {WORKOUT_TYPES.map((wt) => (
              <TouchableOpacity
                key={wt.key}
                style={[
                  styles.typeCard,
                  { borderColor: wt.color + "40" },
                  selectedType === wt.key && { backgroundColor: wt.color + "20", borderColor: wt.color },
                ]}
                onPress={() => setSelectedType(selectedType === wt.key ? null : wt.key)}
                activeOpacity={0.8}
              >
                <Ionicons name={wt.icon as any} size={20} color={wt.color} />
                <Text style={[styles.typeLabel, { color: selectedType === wt.key ? wt.color : COLORS.textSecondary }]}>
                  {wt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Level Filter */}
        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <Text style={styles.sectionTitle}>{t("level")}</Text>
          <View style={styles.chipRow}>
            {LEVELS.map((lvl) => (
              <TouchableOpacity
                key={lvl}
                style={[
                  styles.chip,
                  selectedLevel === lvl && { backgroundColor: LEVEL_COLORS[lvl] + "25", borderColor: LEVEL_COLORS[lvl] },
                ]}
                onPress={() => setSelectedLevel(selectedLevel === lvl ? null : lvl)}
              >
                <Text style={[styles.chipText, selectedLevel === lvl && { color: LEVEL_COLORS[lvl] }]}>
                  {t(lvl)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Duration Filter */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Text style={styles.sectionTitle}>{t("duration")}</Text>
          <View style={styles.chipRow}>
            {DURATIONS.map((d) => (
              <TouchableOpacity
                key={d.key}
                style={[
                  styles.chip,
                  selectedDuration === d.key && { backgroundColor: COLORS.blue + "25", borderColor: COLORS.blue },
                ]}
                onPress={() => setSelectedDuration(selectedDuration === d.key ? null : d.key)}
              >
                <Text style={[styles.chipText, selectedDuration === d.key && { color: COLORS.blue }]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Body Focus (when filtering) */}
        {showResults && selectedBody === null && (
          <Animated.View entering={FadeInDown.delay(220).springify()}>
            <Text style={styles.sectionTitle}>{t("bodyFocus")}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.bodyRow}>
                {BODY_FOCUS_CATEGORIES.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={styles.bodyCard}
                    onPress={() => setSelectedBody(item.key)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: item.image }} style={styles.bodyImage} resizeMode="cover" />
                    <View style={styles.bodyOverlay} />
                    <Text style={styles.bodyLabel}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        )}

        {/* Search Results */}
        {showResults && (
          <Animated.View entering={FadeInDown.springify()}>
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
                <Animated.View key={ex.id} entering={FadeInDown.delay(i * 30).springify()}>
                  <TouchableOpacity
                    style={styles.resultRow}
                    onPress={() =>
                      router.push({ pathname: "/exercise/detail", params: { id: ex.id, category: ex.category } })
                    }
                    activeOpacity={0.8}
                  >
                    <View style={[styles.resultIcon, { backgroundColor: getCategoryColor(ex.category) + "20" }]}>
                      <Ionicons name={getCategoryIcon(ex.category) as any} size={20} color={getCategoryColor(ex.category)} />
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
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  searchIcon: { marginLeft: SPACING.xs },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: SIZES.base,
    color: COLORS.text,
    height: 40,
    paddingVertical: 0,
  },
  clearBtn: { padding: 4 },
  cancelBtn: { paddingHorizontal: SPACING.sm, paddingVertical: 4 },
  cancelText: { fontFamily: FONTS.medium, fontSize: SIZES.base, color: COLORS.primary },

  content: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text, marginBottom: SPACING.md, marginTop: SPACING.sm },

  bodyRow: { flexDirection: "row", gap: SPACING.sm, paddingBottom: SPACING.md },
  bodyCard: {
    width: 100,
    height: 120,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    position: "relative",
    borderWidth: 2,
    borderColor: "transparent",
  },
  bodyCardActive: { borderColor: COLORS.primary },
  bodyImage: { width: "100%", height: "100%", position: "absolute" },
  bodyOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  bodyLabel: {
    position: "absolute",
    bottom: SPACING.sm,
    left: SPACING.sm,
    right: SPACING.sm,
    fontFamily: FONTS.bold,
    fontSize: SIZES.sm,
    color: "#fff",
  },
  bodyCheck: {
    position: "absolute",
    top: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: COLORS.background + "CC",
    borderRadius: RADIUS.full,
  },

  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: "47%",
  },
  typeLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },

  chipRow: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.md, flexWrap: "wrap" },
  chip: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.textSecondary },

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

  emptyState: { alignItems: "center", paddingVertical: SPACING.xxxl, gap: SPACING.md },
  emptyText: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text },
  emptySubText: { fontFamily: FONTS.regular, fontSize: SIZES.base, color: COLORS.textSecondary },
});
