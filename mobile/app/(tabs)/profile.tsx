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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuth } from "@/context/AuthContext";
import { COLORS, FONTS, SIZES, RADIUS, SPACING } from "@/constants/theme";

const GOAL_LABELS = { lose: "Lose Weight", gain: "Build Muscle", maintain: "Stay Fit" };
const LEVEL_LABELS = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

function RowItem({ icon, label, value, onPress, iconColor }: any) {
  return (
    <TouchableOpacity style={styles.rowItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.rowIcon, { backgroundColor: (iconColor || COLORS.primary) + "20" }]}>
        <Ionicons name={icon} size={18} color={iconColor || COLORS.primary} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, isGuest } = useAuth();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [notifs, setNotifs] = useState(true);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out", style: "destructive",
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
          <Text style={styles.email}>{isGuest ? "Guest Mode" : user?.email}</Text>
          {isGuest && (
            <TouchableOpacity style={styles.upgradeBtn} onPress={() => router.replace("/auth")}>
              <Text style={styles.upgradeBtnText}>Create Account</Text>
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
            <Text style={styles.statLbl}>Goal</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{LEVEL_LABELS[user?.fitnessLevel ?? "beginner"].charAt(0).toUpperCase()}{LEVEL_LABELS[user?.fitnessLevel ?? "beginner"].slice(1, 3)}</Text>
            <Text style={styles.statLbl}>Level</Text>
          </View>
        </Animated.View>

        {/* Settings */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Text style={styles.sectionTitle}>Fitness Profile</Text>
          <View style={styles.section}>
            <RowItem icon="person-outline" label="Display Name" value={user?.displayName} iconColor={COLORS.primary} />
            <RowItem icon="scale-outline" label="Weight" value={user?.weight ? `${user.weight} kg` : "Set weight"} iconColor={COLORS.amber} />
            <RowItem icon="resize-outline" label="Height" value={user?.height ? `${user.height} cm` : "Set height"} iconColor={COLORS.blue} />
            <RowItem
              icon="trophy-outline"
              label="Goal"
              value={GOAL_LABELS[user?.goal ?? "maintain"]}
              iconColor={COLORS.secondary}
            />
            <RowItem
              icon="flash-outline"
              label="Fitness Level"
              value={LEVEL_LABELS[user?.fitnessLevel ?? "beginner"]}
              iconColor={COLORS.purple}
              style={{ borderBottomWidth: 0 }}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.section}>
            <View style={styles.rowItem}>
              <View style={[styles.rowIcon, { backgroundColor: COLORS.primary + "20" }]}>
                <Ionicons name="notifications-outline" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.rowLabel}>Notifications</Text>
              <Switch
                value={notifs}
                onValueChange={setNotifs}
                trackColor={{ false: COLORS.border, true: COLORS.primary + "60" }}
                thumbColor={notifs ? COLORS.primary : COLORS.textMuted}
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.section}>
            <RowItem icon="help-circle-outline" label="Help & FAQ" iconColor={COLORS.blue} />
            <RowItem icon="shield-outline" label="Privacy Policy" iconColor={COLORS.textSecondary} />
            <RowItem icon="information-circle-outline" label="About FitAI" value="v1.0.0" iconColor={COLORS.textSecondary} />
          </View>
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: SPACING.xxxl + 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING.xl },
  avatarSection: { alignItems: "center", paddingVertical: SPACING.xl },
  avatarBg: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.primary + "40",
    marginBottom: SPACING.md,
  },
  initials: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.primary },
  name: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.text },
  email: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 4 },
  upgradeBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  upgradeBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.sm, color: COLORS.background },
  statsRow: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  statItem: { flex: 1, alignItems: "center" },
  statVal: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text },
  statLbl: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: COLORS.border },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.textSecondary, marginBottom: SPACING.sm, textTransform: "uppercase", letterSpacing: 0.5 },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
    overflow: "hidden",
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.base,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { flex: 1, fontFamily: FONTS.medium, fontSize: SIZES.base, color: COLORS.text },
  rowRight: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  rowValue: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.error + "15",
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.error + "30",
    marginBottom: SPACING.md,
  },
  logoutText: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.error },
});
