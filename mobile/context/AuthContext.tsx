import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  weight?: number;
  height?: number;
  goal?: "lose" | "gain" | "maintain";
  fitnessLevel?: "beginner" | "intermediate" | "advanced";
  token?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isGuest: boolean;
  pendingVerifyEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    mobile: string
  ) => Promise<{ otpPreview?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<{ otpPreview?: string }>;
  googleLogin: (
    idToken: string,
    email: string,
    firstName: string,
    lastName: string,
    photoUrl?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const GUEST_USER: UserProfile = {
  uid: "guest_" + Date.now().toString(),
  email: "guest@fitai.app",
  displayName: "Athlete",
  weight: 75,
  height: 175,
  goal: "maintain",
  fitnessLevel: "beginner",
};

async function apiFetch(path: string, body: object): Promise<any> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Request failed");
  }
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [pendingVerifyEmail, setPendingVerifyEmail] = useState<string | null>(null);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const stored = await AsyncStorage.getItem("fitai_user");
      const guestMode = await AsyncStorage.getItem("fitai_guest");
      if (guestMode === "true") {
        setUser(GUEST_USER);
        setIsGuest(true);
      } else if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load user:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error("Email and password required");
    const data = await apiFetch("/auth/login", { email, password });
    const profile: UserProfile = {
      uid: data.user.email,
      email: data.user.email,
      displayName: `${data.user.first_name} ${data.user.last_name}`.trim(),
      token: data.token,
    };
    await AsyncStorage.setItem("fitai_user", JSON.stringify(profile));
    await AsyncStorage.setItem("fitai_token", data.token);
    await AsyncStorage.removeItem("fitai_guest");
    setUser(profile);
    setIsGuest(false);
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    mobile: string
  ): Promise<{ otpPreview?: string }> => {
    if (!email || !password || !firstName)
      throw new Error("All fields required");
    const data = await apiFetch("/auth/register", {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      mobile,
    });
    setPendingVerifyEmail(email.toLowerCase().trim());
    return { otpPreview: data.otp_preview };
  };

  const verifyOtp = async (email: string, otp: string) => {
    const data = await apiFetch("/auth/verify-otp", { email, otp });
    const profile: UserProfile = {
      uid: data.user.email,
      email: data.user.email,
      displayName: `${data.user.first_name} ${data.user.last_name}`.trim(),
      token: data.token,
    };
    await AsyncStorage.setItem("fitai_user", JSON.stringify(profile));
    await AsyncStorage.setItem("fitai_token", data.token);
    await AsyncStorage.removeItem("fitai_guest");
    setPendingVerifyEmail(null);
    setUser(profile);
    setIsGuest(false);
  };

  const resendOtp = async (email: string): Promise<{ otpPreview?: string }> => {
    const data = await apiFetch("/auth/resend-otp", { email });
    return { otpPreview: data.otp_preview };
  };

  const googleLogin = async (
    idToken: string,
    email: string,
    firstName: string,
    lastName: string,
    photoUrl?: string
  ) => {
    const data = await apiFetch("/auth/google", {
      id_token: idToken,
      email,
      first_name: firstName,
      last_name: lastName,
      photo_url: photoUrl || "",
    });
    const profile: UserProfile = {
      uid: data.user.email,
      email: data.user.email,
      displayName: `${data.user.first_name} ${data.user.last_name}`.trim(),
      photoURL: photoUrl,
      token: data.token,
    };
    await AsyncStorage.setItem("fitai_user", JSON.stringify(profile));
    await AsyncStorage.setItem("fitai_token", data.token);
    await AsyncStorage.removeItem("fitai_guest");
    setUser(profile);
    setIsGuest(false);
  };

  const logout = async () => {
    try {
      const token = await AsyncStorage.getItem("fitai_token");
      if (token) {
        await fetch(`${API_BASE}/auth/logout?token=${encodeURIComponent(token)}`, {
          method: "POST",
        }).catch(() => {});
      }
    } catch {}
    await AsyncStorage.removeItem("fitai_user");
    await AsyncStorage.removeItem("fitai_guest");
    await AsyncStorage.removeItem("fitai_token");
    setUser(null);
    setIsGuest(false);
  };

  const continueAsGuest = async () => {
    await AsyncStorage.setItem("fitai_guest", "true");
    setUser(GUEST_USER);
    setIsGuest(true);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    await AsyncStorage.setItem("fitai_user", JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isGuest,
        pendingVerifyEmail,
        login,
        register,
        verifyOtp,
        resendOtp,
        googleLogin,
        logout,
        continueAsGuest,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
