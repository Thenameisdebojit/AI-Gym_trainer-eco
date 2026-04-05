import React, { useState } from "react";
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

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function SettingRow({
  icon,
  label,
  sublabel,
  right,
  onPress,
  isLast,
}: {
  icon: string;
  label: string;
  sublabel?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.settingRow, isLast && styles.settingRowLast]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingIconWrap}>
        <Ionicons name={icon as any} size={20} color={COLORS.textSecondary} />
      </View>
      <View style={styles.settingText}>
        <Text style={styles.settingLabel}>{label}</Text>
        {sublabel && <Text style={styles.settingSubLabel}>{sublabel}</Text>}
      </View>
      <View style={styles.settingRight}>{right}</View>
    </TouchableOpacity>
  );
}

function DropdownSelect({
  value,
  label,
  onPress,
}: {
  value: string;
  label?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.dropdown} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.dropdownText}>{value}</Text>
      <Ionicons name="chevron-down" size={14} color={COLORS.textMuted} />
    </TouchableOpacity>
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
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Select Language</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {LANGUAGE_OPTIONS.map((opt) => {
              const isSelected = current === opt.code;
              return (
                <TouchableOpacity
                  key={opt.code}
                  style={styles.langOption}
                  onPress={() => { onSelect(opt.code); onClose(); }}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.langRadio,
                      isSelected && styles.langRadioSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.langRadioDot} />}
                  </View>
                  <Text style={styles.langFlag}>{opt.flag}</Text>
                  <Text
                    style={[
                      styles.langNativeLabel,
                      isSelected && { color: COLORS.primary },
                    ]}
                  >
                    {opt.nativeLabel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function UnitsPickerModal({
  visible,
  current,
  onSelect,
  onClose,
}: {
  visible: boolean;
  current: "metric" | "imperial";
  onSelect: (v: "metric" | "imperial") => void;
  onClose: () => void;
}) {
  const OPTIONS = [
    { value: "metric" as const, label: "Metric (kg/cm)" },
    { value: "imperial" as const, label: "Imperial (lbs/ft)" },
  ];
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.modalSheet, { paddingBottom: SPACING.xl }]}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Units</Text>
          {OPTIONS.map((opt) => {
            const isSelected = current === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={styles.langOption}
                onPress={() => { onSelect(opt.value); onClose(); }}
                activeOpacity={0.7}
              >
                <View style={[styles.langRadio, isSelected && styles.langRadioSelected]}>
                  {isSelected && <View style={styles.langRadioDot} />}
                </View>
                <Text style={[styles.langNativeLabel, isSelected && { color: COLORS.primary }]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
  const [unitsModalVisible, setUnitsModalVisible] = useState(false);

  const currentLang = LANGUAGE_OPTIONS.find((o) => o.code === language);
  const unitsLabel = settings.units === "metric" ? "Metric (kg/cm)" : "Imperial (lbs/ft)";

  const handleLogout = () => {
    Alert.alert(t("signOut"), "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
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

        {/* Page title */}
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.pageHeader}>
          <Text style={styles.pageTitle}>{t("settings")}</Text>
          <Text style={styles.pageSubtitle}>App preferences and profile</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile")} style={styles.avatarBtn}>
            <View style={styles.avatarSmall}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Profile Card */}
        <Animated.View entering={FadeInDown.delay(60).springify()} style={styles.profileCard}>
          <View style={styles.avatarBg}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.displayName ?? "Athlete"}</Text>
            <Text style={styles.email}>{isGuest ? t("guestMode") : user?.email}</Text>
          </View>
          {isGuest && (
            <TouchableOpacity style={styles.upgradeBtn} onPress={() => router.replace("/auth")}>
              <Text style={styles.upgradeBtnText}>{t("createAccount")}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* SECTION: UNITS & METRICS */}
        <Animated.View entering={FadeInDown.delay(120).springify()}>
          <SectionHeader title="UNITS & METRICS" />
          <View style={styles.section}>
            <SettingRow
              icon="options-outline"
              label={t("units")}
              sublabel="Metric or Imperial"
              right={
                <DropdownSelect
                  value={unitsLabel}
                  onPress={() => setUnitsModalVisible(true)}
                />
              }
              onPress={() => setUnitsModalVisible(true)}
            />
            <SettingRow
              icon="speedometer-outline"
              label={t("difficulty")}
              sublabel="Auto-adjust based on performance"
              isLast
              right={
                <Switch
                  value={settings.difficulty}
                  onValueChange={(v) => updateSettings({ difficulty: v })}
                  trackColor={{ false: COLORS.border, true: COLORS.primary + "60" }}
                  thumbColor={settings.difficulty ? COLORS.primary : COLORS.textMuted}
                />
              }
            />
          </View>
        </Animated.View>

        {/* SECTION: AUDIO & VOICE */}
        <Animated.View entering={FadeInDown.delay(180).springify()}>
          <SectionHeader title="AUDIO & VOICE" />
          <View style={styles.section}>
            <SettingRow
              icon="volume-medium-outline"
              label="Sound Effects"
              sublabel="Exercise cues and transitions"
              right={
                <Switch
                  value={settings.soundEffects}
                  onValueChange={(v) => updateSettings({ soundEffects: v })}
                  trackColor={{ false: COLORS.border, true: COLORS.primary + "60" }}
                  thumbColor={settings.soundEffects ? COLORS.primary : COLORS.textMuted}
                />
              }
            />
            <SettingRow
              icon="mic-outline"
              label={t("voiceCoach")}
              sublabel="Audio guidance during workouts"
              right={
                <Switch
                  value={settings.voiceCoach}
                  onValueChange={(v) => updateSettings({ voiceCoach: v })}
                  trackColor={{ false: COLORS.border, true: COLORS.primary + "60" }}
                  thumbColor={settings.voiceCoach ? COLORS.primary : COLORS.textMuted}
                />
              }
            />
            <SettingRow
              icon="notifications-outline"
              label={t("notifications")}
              sublabel="Workout reminders & streaks"
              isLast
              right={
                <Switch
                  value={settings.notifications}
                  onValueChange={(v) => updateSettings({ notifications: v })}
                  trackColor={{ false: COLORS.border, true: COLORS.primary + "60" }}
                  thumbColor={settings.notifications ? COLORS.primary : COLORS.textMuted}
                />
              }
            />
          </View>
        </Animated.View>

        {/* SECTION: APP */}
        <Animated.View entering={FadeInDown.delay(240).springify()}>
          <SectionHeader title="APP" />
          <View style={styles.section}>
            <SettingRow
              icon="language-outline"
              label={t("language")}
              sublabel="Display language"
              onPress={() => setLangModalVisible(true)}
              right={
                <DropdownSelect
                  value={`${currentLang?.flag} ${currentLang?.nativeLabel ?? "English"}`}
                  onPress={() => setLangModalVisible(true)}
                />
              }
            />
            <SettingRow
              icon="moon-outline"
              label="Dark Mode"
              sublabel="Enable dark theme"
              right={
                <Switch
                  value={settings.darkMode}
                  onValueChange={(v) => updateSettings({ darkMode: v })}
                  trackColor={{ false: COLORS.border, true: COLORS.primary + "60" }}
                  thumbColor={settings.darkMode ? COLORS.primary : COLORS.textMuted}
                />
              }
            />
            <SettingRow
              icon="heart-outline"
              label="Health Sync"
              sublabel="Sync with Apple Health / Google Fit"
              isLast
              right={
                <Switch
                  value={settings.healthSync}
                  onValueChange={(v) => updateSettings({ healthSync: v })}
                  trackColor={{ false: COLORS.border, true: COLORS.primary + "60" }}
                  thumbColor={settings.healthSync ? COLORS.primary : COLORS.textMuted}
                />
              }
            />
          </View>
        </Animated.View>

        {/* SECTION: DATA */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <SectionHeader title="DATA" />
          <View style={styles.section}>
            <SettingRow
              icon="cloud-upload-outline"
              label="Backup & Restore"
              sublabel="Cloud sync your progress"
              isLast
              right={
                <TouchableOpacity style={styles.backupBtn}>
                  <Text style={styles.backupBtnText}>Backup</Text>
                </TouchableOpacity>
              }
            />
          </View>
        </Animated.View>

        {/* SECTION: SUPPORT */}
        <Animated.View entering={FadeInDown.delay(360).springify()}>
          <SectionHeader title="SUPPORT" />
          <View style={styles.section}>
            <SettingRow
              icon="help-circle-outline"
              label={t("helpFaq")}
              onPress={() => {}}
              right={<Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />}
            />
            <SettingRow
              icon="shield-outline"
              label={t("privacyPolicy")}
              onPress={() => {}}
              right={<Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />}
            />
            <SettingRow
              icon="information-circle-outline"
              label={t("about")}
              isLast
              right={<Text style={styles.versionText}>v2.0.0</Text>}
            />
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

      <UnitsPickerModal
        visible={unitsModalVisible}
        current={settings.units}
        onSelect={(v) => updateSettings({ units: v })}
        onClose={() => setUnitsModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING.xl },

  pageHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
  },
  pageTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.text, flex: 1 },
  pageSubtitle: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 4, flex: 1 },
  avatarBtn: { marginTop: 2 },
  avatarSmall: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primaryDim, alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: COLORS.primary + "50",
  },
  avatarInitials: { fontFamily: FONTS.bold, fontSize: SIZES.sm, color: COLORS.primary },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  avatarBg: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.primaryDim, alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: COLORS.primary + "40",
  },
  initials: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.primary },
  profileInfo: { flex: 1 },
  name: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text },
  email: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  upgradeBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs,
  },
  upgradeBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.xs, color: COLORS.background },

  sectionHeader: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    overflow: "hidden",
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.base,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    minHeight: 64,
  },
  settingRowLast: { borderBottomWidth: 0 },
  settingIconWrap: {
    width: 36, height: 36, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center", justifyContent: "center",
  },
  settingText: { flex: 1 },
  settingLabel: { fontFamily: FONTS.medium, fontSize: SIZES.base, color: COLORS.text },
  settingSubLabel: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textMuted, marginTop: 2 },
  settingRight: { alignItems: "flex-end" },

  dropdown: {
    flexDirection: "row", alignItems: "center", gap: SPACING.xs,
    backgroundColor: COLORS.surfaceLight, borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs + 2,
    borderWidth: 1, borderColor: COLORS.border,
  },
  dropdownText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.text },

  backupBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
  },
  backupBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.sm, color: COLORS.background },

  versionText: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textMuted },

  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: SPACING.sm, backgroundColor: COLORS.error + "15", borderRadius: RADIUS.xl,
    padding: SPACING.base, borderWidth: 1, borderColor: COLORS.error + "30", marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  logoutText: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.error },

  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    maxHeight: "80%",
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: COLORS.border, alignSelf: "center", marginBottom: SPACING.lg,
  },
  modalTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text, marginBottom: SPACING.md },

  langOption: {
    flexDirection: "row", alignItems: "center", gap: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border + "60",
  },
  langRadio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: "center", justifyContent: "center",
  },
  langRadioSelected: { borderColor: COLORS.primary },
  langRadioDot: {
    width: 11, height: 11, borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  langFlag: { fontSize: 22, width: 32, textAlign: "center" },
  langNativeLabel: { fontFamily: FONTS.medium, fontSize: SIZES.base, color: COLORS.text, flex: 1 },
});
