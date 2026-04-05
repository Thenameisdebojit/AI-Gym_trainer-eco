import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useAuth } from "@/context/AuthContext";
import { signInWithGoogle as firebaseGoogleSignIn } from "@/lib/firebase";
import { COLORS, FONTS, SIZES, RADIUS, SPACING } from "@/constants/theme";

type Mode = "login" | "register" | "verify";

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpPreview, setOtpPreview] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const { login, register, verifyOtp, resendOtp, continueAsGuest, googleLogin } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      return Alert.alert("Error", "Please enter your email and password.");
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Login Failed", e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!firstName.trim() || !email.trim() || !password) {
      return Alert.alert("Error", "First name, email and password are required.");
    }
    setLoading(true);
    try {
      const result = await register(email.trim(), password, firstName.trim(), lastName.trim(), mobile.trim());
      setPendingEmail(email.trim().toLowerCase());
      setOtpPreview(result.otpPreview || "");
      setMode("verify");
    } catch (e: any) {
      Alert.alert("Sign Up Failed", e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      return Alert.alert("Error", "Please enter the 6-digit OTP.");
    }
    setLoading(true);
    try {
      await verifyOtp(pendingEmail, otp);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Verification Failed", e.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const result = await resendOtp(pendingEmail);
      setOtpPreview(result.otpPreview || "");
      Alert.alert("Sent", "A new OTP has been sent to your email.");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    router.replace("/(tabs)");
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const { idToken, email, firstName, lastName, photoUrl } = await firebaseGoogleSignIn();
      await googleLogin(idToken, email, firstName, lastName, photoUrl);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert(
        "Google Sign-In",
        e.message?.includes("Firebase")
          ? "Google Sign-In is not yet configured. Add your Firebase credentials to mobile/.env (see .env.production_example for details)."
          : e.message || "Google Sign-In failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (mode === "verify") {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { paddingTop: insets.top }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.logoSection}>
            <View style={styles.logoIcon}>
              <Ionicons name="mail-open-outline" size={36} color={COLORS.primary} />
            </View>
            <Text style={styles.logoText}>Verify Email</Text>
            <Text style={styles.tagline}>We sent a code to {pendingEmail}</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.card}>
            {otpPreview ? (
              <View style={styles.otpPreviewBox}>
                <Text style={styles.otpPreviewText}>Demo OTP: {otpPreview}</Text>
              </View>
            ) : null}

            <View style={styles.inputWrapper}>
              <Ionicons name="keypad-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="6-digit OTP"
                placeholderTextColor={COLORS.textMuted}
                value={otp}
                onChangeText={(v) => setOtp(v.replace(/\D/g, "").slice(0, 6))}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleVerify} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text style={styles.primaryBtnText}>Verify & Continue</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkBtn} onPress={handleResend} disabled={loading}>
              <Text style={styles.linkBtnText}>Resend OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkBtn} onPress={() => setMode("register")}>
              <Text style={[styles.linkBtnText, { color: COLORS.textMuted }]}>← Back to Sign Up</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={[styles.footer, { marginBottom: insets.bottom + SPACING.base }]}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.logoSection}>
          <View style={styles.logoIcon}>
            <Ionicons name="barbell" size={36} color={COLORS.primary} />
          </View>
          <Text style={styles.logoText}>FitAI</Text>
          <Text style={styles.tagline}>Your AI-powered trainer</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.card}>
          <View style={styles.toggle}>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === "login" && styles.toggleActive]}
              onPress={() => setMode("login")}
            >
              <Text style={[styles.toggleText, mode === "login" && styles.toggleTextActive]}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === "register" && styles.toggleActive]}
              onPress={() => setMode("register")}
            >
              <Text style={[styles.toggleText, mode === "register" && styles.toggleTextActive]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {mode === "register" && (
            <>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor={COLORS.textMuted}
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor={COLORS.textMuted}
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number"
                  placeholderTextColor={COLORS.textMuted}
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="phone-pad"
                />
              </View>
            </>
          )}

          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.inputFlex]}
              placeholder="Password"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
              <Ionicons
                name={showPass ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={mode === "login" ? handleLogin : handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.background} />
            ) : (
              <Text style={styles.primaryBtnText}>
                {mode === "login" ? "Sign In" : "Create Account"}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleBtn} onPress={handleGoogle} disabled={loading}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.guestBtn, { marginTop: SPACING.sm }]} onPress={handleGuest}>
            <Ionicons name="flash-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.guestBtnText}>Continue as Guest</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={[styles.footer, { marginBottom: insets.bottom + SPACING.base }]}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: "center",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: SPACING.xxl,
    marginTop: SPACING.xl,
  },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary + "40",
  },
  logoText: {
    fontSize: SIZES.hero,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: "center",
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.lg,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: "center",
    borderRadius: RADIUS.md,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.base,
    color: COLORS.textMuted,
  },
  toggleTextActive: {
    color: COLORS.background,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.base,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: FONTS.regular,
    fontSize: SIZES.base,
    color: COLORS.text,
  },
  inputFlex: {
    flex: 1,
  },
  eyeBtn: {
    padding: SPACING.xs,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.xs,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  primaryBtnText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.base,
    color: COLORS.background,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginHorizontal: SPACING.md,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceLight,
    marginBottom: SPACING.sm,
  },
  googleIcon: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: "#4285F4",
  },
  googleBtnText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.base,
    color: COLORS.text,
  },
  guestBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  guestBtnText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
  },
  footer: {
    textAlign: "center",
    fontSize: SIZES.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    marginTop: SPACING.xl,
  },
  otpPreviewBox: {
    backgroundColor: "#F0FDF4",
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  otpPreviewText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: "#15803D",
    textAlign: "center",
  },
  linkBtn: {
    paddingVertical: SPACING.sm,
    alignItems: "center",
    marginTop: SPACING.xs,
  },
  linkBtnText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.primary,
  },
});
