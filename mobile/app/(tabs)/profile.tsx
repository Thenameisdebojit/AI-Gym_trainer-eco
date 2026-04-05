import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Switch,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuth } from "@/context/AuthContext";
import { COLORS, FONTS, SIZES, RADIUS, SPACING } from "@/constants/theme";
import {
  useLanguage,
  useTranslation,
  LANGUAGE_OPTIONS,
  Language,
} from "@/context/LanguageContext";

const GOAL_LABELS = { lose: "Lose Weight", gain: "Build Muscle", maintain: "Stay Fit" };
const LEVEL_LABELS = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

function RowItem({ icon, label, value, onPress, iconColor, rightElement }: any) {
  return (
    <TouchableOpacity style={styles.rowItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.rowIcon, { backgroundColor: (iconColor || COLORS.primary) + "20" }]}>
        <Ionicons name={icon} size={18} color={iconColor || COLORS.primary} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {rightElement ? (
          rightElement
        ) : (
          <>
            {value && <Text style={styles.rowValue}>{value}</Text>}
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

function SwitchRow({ icon, label, value, onValueChange, iconColor }: any) {
  return (
    <View style={styles.rowItem}>
      <View style={[styles.rowIcon, { backgroundColor: (iconColor || COLORS.primary) + "20" }]}>
        <Ionicons name={icon} size={18} color={iconColor || COLORS.primary} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.border, true: COLORS.primary + "60" }}
        thumbColor={value ? COLORS.primary : COLORS.textMuted}
      />
    </View>
  );
}

function LanguagePickerModal({
  visible,
  current,
  onSelect,
  onClose,
}: {
  visible: boolean;
  current: Language;
  onSelect: (lang: Language) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <Animated.View entering={FadeInDown.springify()} style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Select Language</Text>
          {LANGUAGE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.code}
              style={[styles.langOption, current === opt.code && styles.langOptionActive]}
              onPress={() => {
                onSelect(opt.code);
                onClose();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.langFlag}>{opt.flag}</Text>
              <View style={styles.langText}>
                <Text style={[styles.langLabel, current === opt.code && { color: COLORS.primary }]}>
                  {opt.label}
                </Text>
                <Text style={styles.langNative}>{opt.nativeLabel}</Text>
              </View>
              {current === opt.code && (
                <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, isGuest } = useAuth();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { settings, setLanguage, updateSettings, language } = useLanguage();
  const { t } = useTranslation();
  const [langModalVisible, setLangModalVisible] = useState(false);

  const currentLang = LANGUAGE_OPTIONS.find((o) => o.code === language);

  const handleLogout = () => {
    Alert.alert(t("signOut"), "Are you sure you want to sign out?", [
      { text: t("cancel") ?? "Cancel", style: "cancel" },
      {
        text: t("signOut"),
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/auth");
        },
      },
    ]);
  };

  const initials = user?.displayName
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "A";

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.avatarSection}>
          <View style={styles.avatarBg}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.displayName ?? "Athlete"}</Text>
          <Text style={styles.email}>{isGuest ? t("guestMode") : user?.email}</Text>
          {isGuest && (
            <TouchableOpacity style={styles.upgradeBtn} onPress={() => router.replace("/auth")}>
              <Text style={styles.upgradeBtnText}>{t("createAccount")}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Stats Summary */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{user?.weight ?? "—"}</Text>
            <Text style={styles.statLbl}>kg</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{user?.height ?? "—"}</Text>
            <Text style={styles.statLbl}>cm</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{GOAL_LABELS[user?.goal ?? "maintain"].split(" ")[0]}</Text>
            <Text style={styles.statLbl}>{t("goal")}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>
              {LEVEL_LABELS[user?.fitnessLevel ?? "beginner"].charAt(0).toUpperCase()}
              {LEVEL_LABELS[user?.fitnessLevel ?? "beginner"].slice(1, 3)}
            </Text>
            <Text style={styles.statLbl}>{t("level")}</Text>
          </View>
        </Animated.View>

        {/* Fitness Profile */}
        <Animated.View entering={FadeInDown.delay(180).springify()}>
          <Text style={styles.sectionTitle}>{t("fitnessProfile")}</Text>
          <View style={styles.section}>
            <RowItem icon="person-outline" label={t("displayName")} value={user?.displayName} iconColor={COLORS.primary} />
            <RowItem icon="scale-outline" label={t("weight")} value={user?.weight ? `${user.weight} kg` : "Set weight"} iconColor={COLORS.amber} />
            <RowItem icon="resize-outline" label={t("height")} value={user?.height ? `${user.height} cm` : "Set height"} iconColor={COLORS.blue} />
            <RowItem icon="trophy-outline" label={t("goal")} value={GOAL_LABELS[user?.goal ?? "maintain"]} iconColor={COLORS.secondary} />
            <RowItem icon="flash-outline" label={t("fitnessLevel")} value={LEVEL_LABELS[user?.fitnessLevel ?? "beginner"]} iconColor={COLORS.purple} />
          </View>
        </Animated.View>

        {/* Preferences */}
        <Animated.View entering={FadeInDown.delay(260).springify()}>
          <Text style={styles.sectionTitle}>{t("preferences")}</Text>
          <View style={styles.section}>

            {/* Language */}
            <RowItem
              icon="language-outline"
              label={t("language")}
              iconColor={COLORS.blue}
              onPress={() => setLangModalVisible(true)}
              rightElement={
                <View style={styles.langPreview}>
                  <Text style={styles.langPreviewFlag}>{currentLang?.flag}</Text>
                  <Text style={styles.langPreviewText}>{currentLang?.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                </View>
              }
            />

            {/* Units */}
            <View style={styles.rowItem}>
              <View style={[styles.rowIcon, { backgroundColor: COLORS.amber + "20" }]}>
                <Ionicons name="options-outline" size={18} color={COLORS.amber} />
              </View>
              <Text style={styles.rowLabel}>{t("units")}</Text>
              <View style={styles.segmentRow}>
                {(["metric", "imperial"] as const).map((u) => (
                  <TouchableOpacity
                    key={u}
                    style={[styles.segment, settings.units === u && styles.segmentActive]}
                    onPress={() => updateSettings({ units: u })}
                  >
                    <Text style={[styles.segmentText, settings.units === u && styles.segmentTextActive]}>
                      {u === "metric" ? t("metric") : t("imperial")}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Difficulty */}
            <View style={[styles.rowItem, styles.rowItemColumn]}>
              <View style={styles.rowItemHeader}>
                <View style={[styles.rowIcon, { backgroundColor: COLORS.purple + "20" }]}>
                  <Ionicons name="speedometer-outline" size={18} color={COLORS.purple} />
                </View>
                <Text style={styles.rowLabel}>{t("difficulty")}</Text>
              </View>
              <View style={styles.diffRow}>
                {(["beginner", "intermediate", "advanced"] as const).map((d) => {
                  const colors = { beginner: COLORS.primary, intermediate: COLORS.amber, advanced: COLORS.secondary };
                  const active = settings.difficulty === d;
                  return (
                    <TouchableOpacity
                      key={d}
                      style={[
                        styles.diffChip,
                        { borderColor: colors[d] + "50" },
                        active && { backgroundColor: colors[d] + "20", borderColor: colors[d] },
                      ]}
                      onPress={() => updateSettings({ difficulty: d })}
                    >
                      <Text style={[styles.diffChipText, active && { color: colors[d] }]}>
                        {t(d)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Voice Coach */}
            <SwitchRow
              icon="mic-outline"
              label={t("voiceCoach")}
              value={settings.voiceCoach}
              onValueChange={(v: boolean) => updateSettings({ voiceCoach: v })}
              iconColor={COLORS.blue}
            />

            {/* Notifications */}
            <SwitchRow
              icon="notifications-outline"
              label={t("notifications")}
              value={settings.notifications}
              onValueChange={(v: boolean) => updateSettings({ notifications: v })}
              iconColor={COLORS.primary}
            />
          </View>
        </Animated.View>

        {/* Support */}
        <Animated.View entering={FadeInDown.delay(340).springify()}>
          <Text style={styles.sectionTitle}>{t("support")}</Text>
          <View style={styles.section}>
            <RowItem icon="help-circle-outline" label={t("helpFaq")} iconColor={COLORS.blue} />
            <RowItem icon="shield-outline" label={t("privacyPolicy")} iconColor={COLORS.textSecondary} />
            <RowItem icon="information-circle-outline" label={t("about")} value="v2.0.0" iconColor={COLORS.textSecondary} />
          </View>
        </Animated.View>

        {/* Sign Out */}
        <Animated.View entering={FadeInDown.delay(420).springify()}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>{t("signOut")}</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: SPACING.xxxl + 20 }} />
      </ScrollView>

      <LanguagePickerModal
        visible={langModalVisible}
        current={language}
        onSelect={setLanguage}
        onClose={() => setLangModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING.xl },

  avatarSection: { alignItems: "center", paddingVertical: SPACING.xl },
  avatarBg: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: COLORS.primaryDim, alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: COLORS.primary + "40", marginBottom: SPACING.md,
  },
  initials: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.primary },
  name: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.text },
  email: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 4 },
  upgradeBtn: {
    marginTop: SPACING.md, backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm,
  },
  upgradeBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.sm, color: COLORS.background },

  statsRow: {
    flexDirection: "row", backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.xl,
  },
  statItem: { flex: 1, alignItems: "center" },
  statVal: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text },
  statLbl: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: COLORS.border },

  sectionTitle: {
    fontFamily: FONTS.bold, fontSize: SIZES.sm, color: COLORS.textSecondary,
    marginBottom: SPACING.sm, textTransform: "uppercase", letterSpacing: 0.5,
  },
  section: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.xl, overflow: "hidden",
  },
  rowItem: {
    flexDirection: "row", alignItems: "center", padding: SPACING.base,
    gap: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  rowItemColumn: { flexDirection: "column", alignItems: "stretch", gap: SPACING.sm },
  rowItemHeader: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  rowIcon: { width: 36, height: 36, borderRadius: RADIUS.sm, alignItems: "center", justifyContent: "center" },
  rowLabel: { flex: 1, fontFamily: FONTS.medium, fontSize: SIZES.base, color: COLORS.text },
  rowRight: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  rowValue: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary },

  langPreview: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  langPreviewFlag: { fontSize: 18 },
  langPreviewText: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary },

  segmentRow: { flexDirection: "row", gap: 4 },
  segment: {
    paddingHorizontal: SPACING.sm, paddingVertical: 5,
    borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  segmentActive: { backgroundColor: COLORS.primary + "20", borderColor: COLORS.primary },
  segmentText: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.textMuted },
  segmentTextActive: { color: COLORS.primary },

  diffRow: { flexDirection: "row", gap: SPACING.sm, paddingLeft: 52 },
  diffChip: {
    paddingHorizontal: SPACING.sm, paddingVertical: 5,
    borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  diffChipText: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.textMuted },

  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: SPACING.sm, backgroundColor: COLORS.error + "15", borderRadius: RADIUS.xl,
    padding: SPACING.base, borderWidth: 1, borderColor: COLORS.error + "30", marginBottom: SPACING.md,
  },
  logoutText: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.error },

  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.surface, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl,
    padding: SPACING.xl, paddingBottom: SPACING.xxxl, borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border,
    alignSelf: "center", marginBottom: SPACING.lg,
  },
  modalTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text, marginBottom: SPACING.lg },
  langOption: {
    flexDirection: "row", alignItems: "center", gap: SPACING.md,
    paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  langOptionActive: { backgroundColor: COLORS.primaryDim + "80" },
  langFlag: { fontSize: 28, width: 40, textAlign: "center" },
  langText: { flex: 1 },
  langLabel: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.text },
  langNative: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
});
