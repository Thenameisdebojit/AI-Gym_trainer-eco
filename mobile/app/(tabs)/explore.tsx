import React from "react";
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

const FEATURED = [
  {
    id: "f1",
    title: "Full Body Burn",
    subtitle: "20 min · Intermediate",
    image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&q=80",
    tag: "POPULAR",
    tagColor: COLORS.primary,
  },
  {
    id: "f2",
    title: "Core Crusher",
    subtitle: "15 min · Beginner",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    tag: "NEW",
    tagColor: "#10B981",
  },
  {
    id: "f3",
    title: "Upper Body Power",
    subtitle: "25 min · Advanced",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    tag: "TRENDING",
    tagColor: COLORS.amber,
  },
];

const QUICK_PICKS = [
  {
    id: "q1",
    title: "5-Min Warm Up",
    icon: "flame-outline" as const,
    color: "#F59E0B",
    image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=300&q=80",
  },
  {
    id: "q2",
    title: "Leg Day",
    icon: "walk-outline" as const,
    color: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=300&q=80",
  },
  {
    id: "q3",
    title: "Chest Focus",
    icon: "barbell-outline" as const,
    color: "#EF4444",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80",
  },
  {
    id: "q4",
    title: "Stretch & Recover",
    icon: "body-outline" as const,
    color: "#10B981",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&q=80",
  },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { t } = useTranslation();

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

          {/* Search + History icons */}
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

        {/* ── Featured (horizontal scroll) ── */}
        <Animated.View entering={FadeInDown.delay(60).springify()}>
          <Text style={styles.sectionTitle}>Featured</Text>
        </Animated.View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -SPACING.xl, marginBottom: SPACING.xl }}
          contentContainerStyle={{ paddingHorizontal: SPACING.xl, gap: SPACING.md }}
        >
          {FEATURED.map((item, i) => (
            <Animated.View key={item.id} entering={FadeInRight.delay(80 + i * 60).springify()}>
              <TouchableOpacity
                style={styles.featuredCard}
                onPress={() => router.push("/search")}
                activeOpacity={0.88}
              >
                <Image source={{ uri: item.image }} style={styles.featuredImg} resizeMode="cover" />
                <View style={styles.featuredOverlay} />
                <View style={[styles.featuredTag, { backgroundColor: item.tagColor }]}>
                  <Text style={styles.featuredTagText}>{item.tag}</Text>
                </View>
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredTitle}>{item.title}</Text>
                  <Text style={styles.featuredSub}>{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        {/* ── Quick Picks (2-col grid) ── */}
        <Animated.View entering={FadeInDown.delay(260).springify()}>
          <Text style={styles.sectionTitle}>Quick Picks</Text>
        </Animated.View>
        <View style={styles.quickGrid}>
          {QUICK_PICKS.map((item, i) => (
            <Animated.View key={item.id} entering={FadeInDown.delay(300 + i * 50).springify()} style={styles.quickCardWrap}>
              <TouchableOpacity
                style={styles.quickCard}
                onPress={() => router.push("/search")}
                activeOpacity={0.85}
              >
                <Image source={{ uri: item.image }} style={styles.quickImg} resizeMode="cover" />
                <View style={styles.quickOverlay} />
                <View style={[styles.quickIconBadge, { backgroundColor: item.color + "CC" }]}>
                  <Ionicons name={item.icon} size={18} color="#fff" />
                </View>
                <Text style={styles.quickTitle}>{item.title}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <View style={{ height: SPACING.xxxl + 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING.xl },

  /* Header */
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

  /* Section title */
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.lg,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },

  /* Featured cards */
  featuredCard: {
    width: 240,
    height: 150,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
  },
  featuredImg: { width: "100%", height: "100%", position: "absolute" },
  featuredOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  featuredTag: {
    position: "absolute",
    top: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  featuredTagText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: "#fff",
    letterSpacing: 0.5,
  },
  featuredInfo: {
    position: "absolute",
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
  },
  featuredTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.base,
    color: "#fff",
  },
  featuredSub: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },

  /* Quick picks grid */
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  quickCardWrap: { width: "48.5%" },
  quickCard: {
    height: 120,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
    justifyContent: "flex-end",
    padding: SPACING.md,
  },
  quickImg: { position: "absolute", width: "100%", height: "100%" },
  quickOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  quickIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xs,
  },
  quickTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.sm,
    color: "#fff",
  },
});
