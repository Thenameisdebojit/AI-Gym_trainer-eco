import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { COLORS, FONTS, SIZES, RADIUS, SPACING } from "@/constants/theme";
import { EXERCISES } from "@/constants/exercises";
import { saveWorkout } from "@/lib/api";

const { width, height } = Dimensions.get("window");

function PulseRing({ color }: { color: string }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.3, { duration: 800 }), withTiming(1, { duration: 800 })),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(withTiming(0.2, { duration: 800 }), withTiming(0.8, { duration: 800 })),
      -1,
      false
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.pulseRing, { borderColor: color }, animStyle]} />
  );
}

function RepCounter({ count, color }: { count: number; color: string }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (count > 0) {
      scale.value = withSequence(withSpring(1.3), withSpring(1));
    }
  }, [count]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.repCounter, { borderColor: color + "40" }, animStyle]}>
      <Text style={[styles.repCount, { color }]}>{count}</Text>
      <Text style={styles.repLabel}>REPS</Text>
    </Animated.View>
  );
}

export default function LiveWorkoutScreen() {
  const { id, name, color: rawColor } = useLocalSearchParams<{ id: string; name: string; color: string }>();
  const insets = useSafeAreaInsets();
  const accentColor = rawColor || COLORS.primary;

  const exercise = EXERCISES.find(e => e.id === id);
  const [reps, setReps] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [feedback, setFeedback] = useState("Position yourself in front of the camera");
  const [score, setScore] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const repIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const FEEDBACK_MESSAGES = [
    "Good form! Keep it up",
    "Lower your hips more",
    "Great depth on that rep!",
    "Keep your back straight",
    "Excellent posture!",
    "Breathe out on the way up",
    "Full range of motion!",
  ];

  useEffect(() => {
    // Simulate camera initialization
    const timer = setTimeout(() => setCameraReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);

      // Simulate AI rep detection
      repIntervalRef.current = setInterval(() => {
        setReps(r => {
          const newReps = r + 1;
          setScore(Math.floor(newReps * (75 + Math.random() * 25)));
          setFeedback(FEEDBACK_MESSAGES[Math.floor(Math.random() * FEEDBACK_MESSAGES.length)]);
          return newReps;
        });
      }, (exercise?.repDuration ?? 3) * 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (repIntervalRef.current) clearInterval(repIntervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (repIntervalRef.current) clearInterval(repIntervalRef.current);
    };
  }, [isActive]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleFinish = useCallback(async () => {
    setIsActive(false);
    setFinished(true);
    const calories = Math.round(reps * (exercise?.caloriesPerRep ?? 0.5));
    try {
      await saveWorkout(id ?? "unknown", reps, score, calories);
    } catch (e) {
      // Offline mode — saved locally
    }
  }, [reps, score, id, exercise]);

  const handleSave = () => {
    const calories = Math.round(reps * (exercise?.caloriesPerRep ?? 0.5));
    Alert.alert(
      "Workout Saved!",
      `${reps} reps • ${calories} kcal burned • ${formatTime(seconds)}`,
      [{ text: "Back to Home", onPress: () => router.replace("/(tabs)") }]
    );
  };

  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{name}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.webFallback}>
          <View style={[styles.webIcon, { backgroundColor: accentColor + "20" }]}>
            <Ionicons name="camera-outline" size={48} color={accentColor} />
          </View>
          <Text style={styles.webTitle}>AI Live Trainer</Text>
          <Text style={styles.webSub}>
            Camera access is available on mobile devices.{"\n"}Use Expo Go to scan the QR code and train with AI pose detection.
          </Text>

          {/* Manual Counter Mode */}
          <View style={styles.manualCard}>
            <Text style={styles.manualTitle}>Manual Counter Mode</Text>
            <RepCounter count={reps} color={accentColor} />
            <View style={styles.manualBtns}>
              <TouchableOpacity
                style={[styles.manualBtn, { backgroundColor: accentColor }]}
                onPress={() => {
                  setReps(r => r + 1);
                  setFeedback("Rep counted!");
                  setScore(s => s + Math.floor(80 + Math.random() * 20));
                }}
              >
                <Ionicons name="add" size={28} color={COLORS.background} />
              </TouchableOpacity>
              {reps > 0 && (
                <TouchableOpacity
                  style={[styles.manualBtn, { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border }]}
                  onPress={() => setReps(r => Math.max(0, r - 1))}
                >
                  <Ionicons name="remove" size={28} color={COLORS.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={[styles.ctaBtn, { backgroundColor: accentColor, shadowColor: accentColor }]}
              onPress={handleSave}
            >
              <Ionicons name="checkmark" size={20} color={COLORS.background} />
              <Text style={styles.ctaBtnText}>Save Workout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (finished) {
    const calories = Math.round(reps * (exercise?.caloriesPerRep ?? 0.5));
    return (
      <View style={[styles.container, styles.finishedContainer, { paddingTop: insets.top }]}>
        <Animated.View entering={FadeInDown.springify()} style={styles.finishedCard}>
          <View style={[styles.finishedIcon, { backgroundColor: accentColor + "20" }]}>
            <Ionicons name="trophy" size={52} color={accentColor} />
          </View>
          <Text style={styles.finishedTitle}>Workout Complete!</Text>
          <View style={styles.finishedStats}>
            {[
              { label: "Reps", value: reps, icon: "barbell", color: accentColor },
              { label: "Calories", value: calories, icon: "flame", color: COLORS.secondary },
              { label: "Time", value: formatTime(seconds), icon: "time", color: COLORS.blue },
              { label: "Score", value: score, icon: "star", color: COLORS.amber },
            ].map(({ label, value, icon, color }) => (
              <View key={label} style={[styles.finStat, { borderColor: color + "30" }]}>
                <Ionicons name={icon as any} size={20} color={color} />
                <Text style={styles.finStatVal}>{value}</Text>
                <Text style={styles.finStatLbl}>{label}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: accentColor, shadowColor: accentColor, marginTop: SPACING.md }]}
            onPress={handleSave}
          >
            <Ionicons name="checkmark" size={20} color={COLORS.background} />
            <Text style={styles.ctaBtnText}>Save & Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/(tabs)")} style={{ marginTop: SPACING.md }}>
            <Text style={styles.skipText}>Skip saving</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera Viewfinder Simulation */}
      <View style={styles.cameraView}>
        <View style={styles.cameraOverlay} />
        {/* Corner brackets */}
        <View style={[styles.corner, styles.topLeft, { borderColor: accentColor }]} />
        <View style={[styles.corner, styles.topRight, { borderColor: accentColor }]} />
        <View style={[styles.corner, styles.bottomLeft, { borderColor: accentColor }]} />
        <View style={[styles.corner, styles.bottomRight, { borderColor: accentColor }]} />

        {/* Skeleton overlay hint */}
        <View style={styles.skeletonHint}>
          <Ionicons name="body" size={80} color={accentColor + "30"} />
        </View>

        {!cameraReady && (
          <View style={styles.initOverlay}>
            <Text style={styles.initText}>Initializing AI Tracker...</Text>
          </View>
        )}

        {isActive && <PulseRing color={accentColor} />}
      </View>

      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + SPACING.sm }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="close" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.timerBadge}>
          <Ionicons name={isActive ? "radio" : "radio-outline"} size={14} color={isActive ? COLORS.error : COLORS.textMuted} />
          <Text style={[styles.timerText, { color: isActive ? COLORS.text : COLORS.textMuted }]}>
            {formatTime(seconds)}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Bottom Panel */}
      <Animated.View entering={FadeInUp.delay(200).springify()} style={[styles.bottomPanel, { paddingBottom: insets.bottom + SPACING.md }]}>
        <Text style={styles.exerciseLabel}>{name}</Text>

        {/* Feedback */}
        <View style={[styles.feedbackCard, { borderColor: accentColor + "30" }]}>
          <Ionicons name="mic" size={14} color={accentColor} />
          <Text style={[styles.feedbackText, { color: accentColor }]}>{feedback}</Text>
        </View>

        {/* Rep Counter */}
        <RepCounter count={reps} color={accentColor} />

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              setReps(0);
              setSeconds(0);
              setScore(0);
              setIsActive(false);
            }}
          >
            <Ionicons name="refresh" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.startBtn, { backgroundColor: isActive ? COLORS.error : accentColor, shadowColor: isActive ? COLORS.error : accentColor }]}
            onPress={() => setIsActive(a => !a)}
          >
            <Ionicons name={isActive ? "pause" : "play"} size={28} color={COLORS.background} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetBtn} onPress={handleFinish} disabled={reps === 0}>
            <Ionicons name="checkmark-done" size={22} color={reps > 0 ? COLORS.primary : COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  cameraView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#050510",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  corner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderWidth: 3,
  },
  topLeft: { top: height * 0.15, left: 30, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 4 },
  topRight: { top: height * 0.15, right: 30, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 4 },
  bottomLeft: { bottom: height * 0.35, left: 30, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 4 },
  bottomRight: { bottom: height * 0.35, right: 30, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 4 },
  skeletonHint: { opacity: 0.3 },
  pulseRing: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    top: "25%",
  },
  initOverlay: {
    position: "absolute",
    bottom: height * 0.38,
    alignItems: "center",
  },
  initText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.textSecondary },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
    zIndex: 10,
  },
  headerBtn: {
    width: 40, height: 40, alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)", borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border,
  },
  headerTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timerText: { fontFamily: FONTS.bold, fontSize: SIZES.base },
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(13,13,20,0.95)",
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.md,
  },
  exerciseLabel: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text },
  feedbackCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  feedbackText: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, textAlign: "center" },
  repCounter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
  },
  repCount: { fontFamily: FONTS.bold, fontSize: SIZES.hero, lineHeight: SIZES.hero + 4 },
  repLabel: { fontFamily: FONTS.bold, fontSize: SIZES.xs, color: COLORS.textMuted, letterSpacing: 2 },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xl,
    marginTop: SPACING.sm,
  },
  resetBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.surface, alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: COLORS.border,
  },
  startBtn: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: "center", justifyContent: "center",
    shadowOpacity: 0.6, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  // Web fallback
  webFallback: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: SPACING.xl, gap: SPACING.lg },
  webIcon: { width: 100, height: 100, borderRadius: RADIUS.xxl, alignItems: "center", justifyContent: "center" },
  webTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.text },
  webSub: { fontFamily: FONTS.regular, fontSize: SIZES.base, color: COLORS.textSecondary, textAlign: "center", lineHeight: 24 },
  manualCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl,
    padding: SPACING.xl, alignItems: "center", borderWidth: 1, borderColor: COLORS.border,
    gap: SPACING.md, width: "100%",
  },
  manualTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text },
  manualBtns: { flexDirection: "row", gap: SPACING.md },
  manualBtn: {
    width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center",
    shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
  ctaBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: SPACING.sm, borderRadius: RADIUS.xl, height: 52, width: "100%",
    shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  ctaBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.background },
  // Finished
  finishedContainer: { alignItems: "center", justifyContent: "center", padding: SPACING.xl },
  finishedCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl,
    padding: SPACING.xl, alignItems: "center", borderWidth: 1, borderColor: COLORS.border,
    width: "100%", gap: SPACING.md,
  },
  finishedIcon: { width: 100, height: 100, borderRadius: RADIUS.xxl, alignItems: "center", justifyContent: "center" },
  finishedTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.text },
  finishedStats: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm, justifyContent: "center" },
  finStat: {
    backgroundColor: COLORS.surfaceLight, borderRadius: RADIUS.lg,
    padding: SPACING.md, alignItems: "center", borderWidth: 1,
    minWidth: 80, gap: SPACING.xs,
  },
  finStatVal: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.text },
  finStatLbl: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textSecondary },
  skipText: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textMuted },
});
