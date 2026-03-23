import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  interpolate,
} from "react-native-reanimated";
import { COLORS, FONTS, SIZES, RADIUS, SPACING } from "@/constants/theme";
import { getCategoryColor, getCategoryIcon } from "@/constants/exercises";
import { useWorkoutStore, WorkoutExercise, CompletedSet } from "@/store/useWorkoutStore";
import { saveWorkout } from "@/lib/api";

const { width } = Dimensions.get("window");

type Phase = "intro" | "exercise" | "rest" | "done";

function ProgressRing({ progress, color, size = 120 }: { progress: number; color: string; size?: number }) {
  const r = (size - 12) / 2;
  const circumference = 2 * Math.PI * r;
  const strokeDash = circumference * (1 - progress);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (progress > 0.99) {
      scale.value = withSequence(withSpring(1.1), withSpring(1));
    }
  }, [progress]);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[{ width: size, height: size, alignItems: "center", justifyContent: "center" }, animStyle]}>
      <View style={{ position: "absolute" }}>
        <Ionicons name="ellipse-outline" size={size} color={color + "20"} />
      </View>
      <View
        style={{
          width: size - 12,
          height: size - 12,
          borderRadius: (size - 12) / 2,
          borderWidth: 5,
          borderColor: color + "20",
          position: "absolute",
        }}
      />
      <View
        style={{
          width: size - 12,
          height: size - 12,
          borderRadius: (size - 12) / 2,
          borderWidth: 5,
          borderColor: "transparent",
          borderTopColor: color,
          position: "absolute",
          transform: [{ rotate: `${progress * 360 - 90}deg` }],
        }}
      />
    </Animated.View>
  );
}

function RepCounterBig({ count, color }: { count: number; color: string }) {
  const scale = useSharedValue(1);
  useEffect(() => {
    if (count > 0) scale.value = withSequence(withSpring(1.25), withSpring(1));
  }, [count]);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[styles.repCircle, { borderColor: color }, animStyle]}>
      <Text style={[styles.repCount, { color }]}>{count}</Text>
      <Text style={styles.repLabel}>REPS</Text>
    </Animated.View>
  );
}

export default function WorkoutSessionScreen() {
  const insets = useSafeAreaInsets();
  const { currentPlan, startSession, addCompletedSet, finishSession, cancelSession } = useWorkoutStore();

  const [phase, setPhase] = useState<Phase>("intro");
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [reps, setReps] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);
  const [feedback, setFeedback] = useState("Get ready! Start when you're in position.");
  const [completedSets, setCompletedSets] = useState<CompletedSet[]>([]);
  const [sessionReps, setSessionReps] = useState(0);
  const [sessionCals, setSessionCals] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoRepRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartRef = useRef(Date.now());

  const FEEDBACK_MESSAGES = [
    "Great form! Keep going!",
    "Stay strong, you've got this!",
    "Full range of motion!",
    "Breathe out on the exertion!",
    "Control the movement!",
    "Excellent! One more!",
    "Keep your core tight!",
    "Perfect tempo!",
  ];
  const REST_DURATION = 45;

  const exercises: WorkoutExercise[] = currentPlan?.exercises ?? [];
  const currentExercise = exercises[exerciseIndex];

  useEffect(() => {
    if (currentPlan) {
      startSession(currentPlan);
      sessionStartRef.current = Date.now();
    }
    return () => {
      clearAllTimers();
    };
  }, []);

  const clearAllTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (restRef.current) clearInterval(restRef.current);
    if (autoRepRef.current) clearInterval(autoRepRef.current);
  };

  useEffect(() => {
    if (phase === "exercise") {
      timerRef.current = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  useEffect(() => {
    if (isActive && phase === "exercise") {
      autoRepRef.current = setInterval(() => {
        setReps(r => {
          const next = r + 1;
          const feedbackIdx = Math.floor(Math.random() * FEEDBACK_MESSAGES.length);
          setFeedback(FEEDBACK_MESSAGES[feedbackIdx]);
          return next;
        });
      }, 2500);
    } else {
      if (autoRepRef.current) clearInterval(autoRepRef.current);
    }
    return () => { if (autoRepRef.current) clearInterval(autoRepRef.current); };
  }, [isActive, phase]);

  const startRest = useCallback(() => {
    setPhase("rest");
    setRestSeconds(REST_DURATION);
    restRef.current = setInterval(() => {
      setRestSeconds(s => {
        if (s <= 1) {
          if (restRef.current) clearInterval(restRef.current);
          setPhase("exercise");
          setReps(0);
          setIsActive(false);
          setFeedback("Rest done! Start the next set.");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, []);

  const handleCompleteSet = useCallback(() => {
    if (!currentExercise) return;
    setIsActive(false);
    if (autoRepRef.current) clearInterval(autoRepRef.current);

    const calories = Math.round(reps * 0.5);
    const score = Math.floor(reps * (75 + Math.random() * 25));

    const completedSet: CompletedSet = {
      exerciseId: currentExercise.id,
      exerciseName: currentExercise.name,
      setNumber: currentSet,
      repsCompleted: reps,
      score,
      calories,
      timestamp: Date.now(),
    };

    addCompletedSet(completedSet);
    setCompletedSets(prev => [...prev, completedSet]);
    setSessionReps(r => r + reps);
    setSessionCals(c => c + calories);

    try {
      saveWorkout(currentExercise.id, reps, score, calories);
    } catch {}

    const totalSets = currentExercise.sets;
    if (currentSet >= totalSets) {
      if (exerciseIndex + 1 >= exercises.length) {
        handleFinishWorkout();
      } else {
        setExerciseIndex(i => i + 1);
        setCurrentSet(1);
        setReps(0);
        startRest();
      }
    } else {
      setCurrentSet(s => s + 1);
      setReps(0);
      startRest();
    }
  }, [currentExercise, currentSet, reps, exerciseIndex, exercises, addCompletedSet, startRest]);

  const handleFinishWorkout = useCallback(() => {
    clearAllTimers();
    const durationSeconds = Math.floor((Date.now() - sessionStartRef.current) / 1000);
    finishSession(durationSeconds);
    setPhase("done");
  }, [finishSession]);

  const handleQuit = () => {
    Alert.alert("Quit Workout?", "Your progress will be lost.", [
      { text: "Continue", style: "cancel" },
      {
        text: "Quit",
        style: "destructive",
        onPress: () => {
          clearAllTimers();
          cancelSession();
          router.back();
        },
      },
    ]);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  if (!currentPlan || exercises.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={56} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>No workout loaded</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (phase === "intro") {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="close" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.introContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.introHero}>
            <View style={[styles.introIconBg, { backgroundColor: COLORS.primary + "20" }]}>
              <Ionicons name="barbell" size={52} color={COLORS.primary} />
            </View>
            <Text style={styles.introTitle}>{currentPlan.name}</Text>
            <Text style={styles.introDesc}>{currentPlan.description}</Text>
            <View style={styles.introBadges}>
              <View style={styles.introBadge}>
                <Ionicons name="layers-outline" size={14} color={COLORS.primary} />
                <Text style={styles.introBadgeText}>{exercises.length} Exercises</Text>
              </View>
              <View style={styles.introBadge}>
                <Ionicons name="time-outline" size={14} color={COLORS.amber} />
                <Text style={[styles.introBadgeText, { color: COLORS.amber }]}>{currentPlan.duration_minutes} min</Text>
              </View>
              <View style={styles.introBadge}>
                <Ionicons name="flash-outline" size={14} color={COLORS.secondary} />
                <Text style={[styles.introBadgeText, { color: COLORS.secondary }]}>{currentPlan.level}</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(120).springify()}>
            <Text style={styles.sectionLabel}>Exercise Plan</Text>
            {exercises.map((ex, i) => {
              const color = getCategoryColor(ex.category as any);
              const icon = getCategoryIcon(ex.category as any);
              return (
                <View key={ex.id + i} style={[styles.exerciseRow, { borderColor: color + "25" }]}>
                  <View style={[styles.exNum, { backgroundColor: color + "20" }]}>
                    <Text style={[styles.exNumText, { color }]}>{i + 1}</Text>
                  </View>
                  <View style={[styles.exIconSmall, { backgroundColor: color + "15" }]}>
                    <Ionicons name={icon as any} size={18} color={color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exName}>{ex.name}</Text>
                    <Text style={styles.exSets}>{ex.sets} sets × {ex.reps} reps</Text>
                  </View>
                  <View style={[styles.catChip, { backgroundColor: color + "15" }]}>
                    <Text style={[styles.catChipText, { color }]}>{ex.category.replace("_", " ")}</Text>
                  </View>
                </View>
              );
            })}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(240).springify()} style={{ height: 120 }} />
        </ScrollView>

        <Animated.View entering={FadeInUp.delay(200).springify()} style={[styles.ctaBar, { paddingBottom: insets.bottom + SPACING.base }]}>
          <TouchableOpacity
            style={styles.startWorkoutBtn}
            onPress={() => setPhase("exercise")}
            activeOpacity={0.85}
          >
            <Ionicons name="play" size={22} color={COLORS.background} />
            <Text style={styles.startWorkoutBtnText}>Begin Workout</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  if (phase === "done") {
    const totalExercises = new Set(completedSets.map(s => s.exerciseId)).size;
    const totalSets = completedSets.length;
    const durationSec = Math.floor((Date.now() - sessionStartRef.current) / 1000);

    return (
      <View style={[styles.container, styles.doneContainer, { paddingTop: insets.top }]}>
        <Animated.View entering={FadeInDown.springify()} style={styles.doneCard}>
          <View style={[styles.doneIconBg, { backgroundColor: COLORS.amber + "20" }]}>
            <Ionicons name="trophy" size={56} color={COLORS.amber} />
          </View>
          <Text style={styles.doneTitle}>Workout Complete!</Text>
          <Text style={styles.doneSub}>You crushed it today. Great work!</Text>

          <View style={styles.doneStats}>
            {[
              { label: "Reps", value: sessionReps, icon: "barbell", color: COLORS.primary },
              { label: "Calories", value: sessionCals, icon: "flame", color: COLORS.secondary },
              { label: "Sets", value: totalSets, icon: "layers", color: COLORS.purple },
              { label: "Time", value: formatTime(durationSec), icon: "time", color: COLORS.blue },
            ].map(({ label, value, icon, color }) => (
              <View key={label} style={[styles.doneStat, { borderColor: color + "30" }]}>
                <Ionicons name={icon as any} size={20} color={color} />
                <Text style={styles.doneStatVal}>{value}</Text>
                <Text style={styles.doneStatLbl}>{label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => router.replace("/(tabs)")}
          >
            <Ionicons name="checkmark" size={20} color={COLORS.background} />
            <Text style={styles.doneBtnText}>Save & Return Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => router.replace("/workout/history")}
          >
            <Text style={styles.historyBtnText}>View Workout History</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  if (phase === "rest") {
    const restProgress = restSeconds / REST_DURATION;
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleQuit} style={styles.iconBtn}>
            <Ionicons name="close" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.sessionTimer}>
            <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.sessionTimerText}>{formatTime(elapsedSeconds)}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <Animated.View entering={FadeIn.duration(300)} style={styles.restCenter}>
          <Text style={styles.restLabel}>Rest Period</Text>
          <Text style={styles.restTimer}>{restSeconds}s</Text>
          <Text style={styles.restSub}>
            Next: {exerciseIndex < exercises.length - 1 || currentSet <= (currentExercise?.sets ?? 1)
              ? currentSet > (currentExercise?.sets ?? 1)
                ? exercises[exerciseIndex + 1]?.name
                : `Set ${currentSet} of ${currentExercise?.sets}`
              : "Final stretch!"}
          </Text>

          <TouchableOpacity
            style={styles.skipRestBtn}
            onPress={() => {
              if (restRef.current) clearInterval(restRef.current);
              setPhase("exercise");
              setReps(0);
              setIsActive(false);
              setFeedback("Get ready! Start when you're in position.");
            }}
          >
            <Text style={styles.skipRestText}>Skip Rest</Text>
            <Ionicons name="play-skip-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  const exerciseColor = getCategoryColor(currentExercise?.category as any) || COLORS.primary;
  const exerciseIcon = getCategoryIcon(currentExercise?.category as any) || "barbell";
  const setProgress = (currentSet - 1) / (currentExercise?.sets ?? 1);
  const overallProgress = (exerciseIndex + setProgress) / exercises.length;
  const targetReps = currentExercise?.reps ?? 12;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleQuit} style={styles.iconBtn}>
          <Ionicons name="close" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.sessionTimer}>
          <Ionicons name={isActive ? "radio" : "time-outline"} size={14} color={isActive ? COLORS.secondary : COLORS.textMuted} />
          <Text style={styles.sessionTimerText}>{formatTime(elapsedSeconds)}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: `${overallProgress * 100}%`,
              backgroundColor: exerciseColor,
            },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.sessionContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.exerciseHeader}>
          <Text style={styles.exercisePosText}>
            Exercise {exerciseIndex + 1} / {exercises.length}
          </Text>
          <Text style={styles.exerciseName}>{currentExercise?.name}</Text>

          <View style={styles.setIndicator}>
            {Array.from({ length: currentExercise?.sets ?? 3 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.setDot,
                  {
                    backgroundColor: i < currentSet - 1
                      ? exerciseColor
                      : i === currentSet - 1
                      ? exerciseColor + "70"
                      : COLORS.border,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.setLabel}>Set {currentSet} of {currentExercise?.sets}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).springify()} style={styles.mainControlArea}>
          <View style={[styles.exerciseIconLg, { backgroundColor: exerciseColor + "15", borderColor: exerciseColor + "30" }]}>
            <Ionicons name={exerciseIcon as any} size={52} color={exerciseColor} />
          </View>

          <Text style={[styles.targetText, { color: exerciseColor }]}>Target: {targetReps} reps</Text>

          <RepCounterBig count={reps} color={exerciseColor} />

          <View style={styles.feedbackPill}>
            <Ionicons name="mic-outline" size={14} color={exerciseColor} />
            <Text style={[styles.feedbackText, { color: exerciseColor }]}>{feedback}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).springify()} style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlBtn, styles.controlBtnSm]}
            onPress={() => setReps(r => Math.max(0, r - 1))}
          >
            <Ionicons name="remove" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlBtn,
              styles.controlBtnLg,
              { backgroundColor: isActive ? COLORS.error : exerciseColor, shadowColor: isActive ? COLORS.error : exerciseColor },
            ]}
            onPress={() => setIsActive(a => !a)}
          >
            <Ionicons name={isActive ? "pause" : "play"} size={32} color={COLORS.background} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, styles.controlBtnSm]}
            onPress={() => setReps(r => r + 1)}
          >
            <Ionicons name="add" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).springify()} style={styles.completeArea}>
          <TouchableOpacity
            style={[
              styles.completeSetBtn,
              { backgroundColor: exerciseColor, shadowColor: exerciseColor },
            ]}
            onPress={handleCompleteSet}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-circle" size={22} color={COLORS.background} />
            <Text style={styles.completeSetBtnText}>
              {currentSet >= (currentExercise?.sets ?? 1) && exerciseIndex + 1 >= exercises.length
                ? "Finish Workout"
                : `Complete Set ${currentSet}`}
            </Text>
          </TouchableOpacity>

          {exerciseIndex > 0 || currentSet > 1 ? (
            <TouchableOpacity style={styles.skipExBtn} onPress={() => {
              if (exerciseIndex + 1 < exercises.length) {
                setExerciseIndex(i => i + 1);
                setCurrentSet(1);
                setReps(0);
                setIsActive(false);
                setFeedback("Get ready! Start when you're in position.");
              } else {
                handleFinishWorkout();
              }
            }}>
              <Text style={styles.skipExText}>Skip Exercise</Text>
              <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </Animated.View>

        {completedSets.length > 0 && (
          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.completedSummary}>
            <Text style={styles.completedLabel}>Completed Sets</Text>
            {completedSets.slice(-3).reverse().map((cs, i) => (
              <View key={i} style={styles.completedRow}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                <Text style={styles.completedText}>
                  {cs.exerciseName} · Set {cs.setNumber} · {cs.repsCompleted} reps
                </Text>
                <Text style={styles.completedCal}>{cs.calories} kcal</Text>
              </View>
            ))}
          </Animated.View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: RADIUS.md,
    alignItems: "center", justifyContent: "center",
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  sessionTimer: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: COLORS.surface, paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs, borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: COLORS.border,
  },
  sessionTimerText: { fontFamily: FONTS.bold, fontSize: SIZES.sm, color: COLORS.text },

  progressBarContainer: { height: 4, backgroundColor: COLORS.border, marginHorizontal: SPACING.xl },
  progressBarFill: { height: 4, borderRadius: 2 },

  sessionContent: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.md },

  exerciseHeader: { alignItems: "center", marginBottom: SPACING.lg },
  exercisePosText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 },
  exerciseName: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.text, textAlign: "center", marginTop: 4 },
  setIndicator: { flexDirection: "row", gap: 8, marginTop: SPACING.md },
  setDot: { width: 10, height: 10, borderRadius: 5 },
  setLabel: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },

  mainControlArea: { alignItems: "center", gap: SPACING.md, marginBottom: SPACING.lg },
  exerciseIconLg: {
    width: 100, height: 100, borderRadius: RADIUS.xxl,
    alignItems: "center", justifyContent: "center",
    borderWidth: 2,
  },
  targetText: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, textTransform: "uppercase", letterSpacing: 0.8 },

  repCircle: {
    width: 130, height: 130, borderRadius: 65,
    borderWidth: 4, alignItems: "center", justifyContent: "center",
    backgroundColor: COLORS.surface,
  },
  repCount: { fontFamily: FONTS.bold, fontSize: 52, lineHeight: 58 },
  repLabel: { fontFamily: FONTS.bold, fontSize: SIZES.xs, color: COLORS.textMuted, letterSpacing: 2 },

  feedbackPill: {
    flexDirection: "row", alignItems: "center", gap: SPACING.xs,
    backgroundColor: COLORS.surface, paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm, borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: COLORS.border, alignSelf: "stretch", justifyContent: "center",
  },
  feedbackText: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, textAlign: "center", flex: 1 },

  controls: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: SPACING.xl, marginBottom: SPACING.lg },
  controlBtn: { alignItems: "center", justifyContent: "center" },
  controlBtnSm: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  controlBtnLg: {
    width: 80, height: 80, borderRadius: 40,
    shadowOpacity: 0.5, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },

  completeArea: { gap: SPACING.sm, marginBottom: SPACING.lg },
  completeSetBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: SPACING.sm, borderRadius: RADIUS.xl, height: 56,
    shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  completeSetBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.background },
  skipExBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, paddingVertical: SPACING.sm },
  skipExText: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textMuted },

  completedSummary: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.base, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.sm,
  },
  completedLabel: { fontFamily: FONTS.bold, fontSize: SIZES.sm, color: COLORS.textSecondary, textTransform: "uppercase", letterSpacing: 0.5 },
  completedRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  completedText: { flex: 1, fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.text },
  completedCal: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs, color: COLORS.secondary },

  restCenter: { flex: 1, alignItems: "center", justifyContent: "center", gap: SPACING.lg, paddingHorizontal: SPACING.xl },
  restLabel: { fontFamily: FONTS.semiBold, fontSize: SIZES.lg, color: COLORS.textSecondary, textTransform: "uppercase", letterSpacing: 1 },
  restTimer: { fontFamily: FONTS.bold, fontSize: 80, color: COLORS.text, lineHeight: 90 },
  restSub: { fontFamily: FONTS.medium, fontSize: SIZES.base, color: COLORS.textSecondary, textAlign: "center" },
  skipRestBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.lg, backgroundColor: COLORS.primaryDim, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.primary + "30" },
  skipRestText: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.primary },

  doneContainer: { alignItems: "center", justifyContent: "center", padding: SPACING.xl },
  doneCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl,
    padding: SPACING.xl, alignItems: "center", borderWidth: 1, borderColor: COLORS.border,
    width: "100%", gap: SPACING.md,
  },
  doneIconBg: { width: 100, height: 100, borderRadius: RADIUS.xxl, alignItems: "center", justifyContent: "center" },
  doneTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.text },
  doneSub: { fontFamily: FONTS.regular, fontSize: SIZES.base, color: COLORS.textSecondary, textAlign: "center" },
  doneStats: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm, justifyContent: "center", width: "100%" },
  doneStat: {
    backgroundColor: COLORS.surfaceLight, borderRadius: RADIUS.lg,
    padding: SPACING.md, alignItems: "center", borderWidth: 1,
    minWidth: "44%", flex: 1, gap: SPACING.xs,
  },
  doneStatVal: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.text },
  doneStatLbl: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textSecondary },
  doneBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl,
    height: 52, width: "100%",
    shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  doneBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.background },
  historyBtn: { paddingVertical: SPACING.sm },
  historyBtnText: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.primary },

  introContent: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.md },
  introHero: { alignItems: "center", gap: SPACING.md, marginBottom: SPACING.xl },
  introIconBg: { width: 100, height: 100, borderRadius: RADIUS.xxl, alignItems: "center", justifyContent: "center" },
  introTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.text, textAlign: "center" },
  introDesc: { fontFamily: FONTS.regular, fontSize: SIZES.base, color: COLORS.textSecondary, textAlign: "center", lineHeight: 22 },
  introBadges: { flexDirection: "row", gap: SPACING.sm, flexWrap: "wrap", justifyContent: "center" },
  introBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: COLORS.primaryDim, paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2, borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: COLORS.primary + "30",
  },
  introBadgeText: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs, color: COLORS.primary },

  sectionLabel: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.text, marginBottom: SPACING.md },
  exerciseRow: {
    flexDirection: "row", alignItems: "center", gap: SPACING.sm,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.base, borderWidth: 1, marginBottom: SPACING.sm,
  },
  exNum: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  exNumText: { fontFamily: FONTS.bold, fontSize: SIZES.sm },
  exIconSmall: {
    width: 36, height: 36, borderRadius: RADIUS.sm,
    alignItems: "center", justifyContent: "center",
  },
  exName: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.text },
  exSets: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  catChip: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.full },
  catChipText: { fontFamily: FONTS.medium, fontSize: SIZES.xs, textTransform: "capitalize" },

  ctaBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.background, paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  startWorkoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, height: 56,
    shadowColor: COLORS.primary, shadowOpacity: 0.5, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  startWorkoutBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.background },

  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", gap: SPACING.lg },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.text },
  backButton: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm,
  },
  backBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.background },
});
