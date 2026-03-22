import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  weight?: number;
  height?: number;
  goal?: "lose" | "gain" | "maintain";
  fitnessLevel?: "beginner" | "intermediate" | "advanced";
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

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
    const mockUser: UserProfile = {
      uid: "user_" + Date.now().toString(),
      email,
      displayName: email.split("@")[0],
      weight: 75,
      height: 175,
      goal: "maintain",
      fitnessLevel: "beginner",
    };
    await AsyncStorage.setItem("fitai_user", JSON.stringify(mockUser));
    await AsyncStorage.removeItem("fitai_guest");
    setUser(mockUser);
    setIsGuest(false);
  };

  const register = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) throw new Error("All fields required");
    const newUser: UserProfile = {
      uid: "user_" + Date.now().toString(),
      email,
      displayName: name,
      weight: 75,
      height: 175,
      goal: "maintain",
      fitnessLevel: "beginner",
    };
    await AsyncStorage.setItem("fitai_user", JSON.stringify(newUser));
    await AsyncStorage.removeItem("fitai_guest");
    setUser(newUser);
    setIsGuest(false);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("fitai_user");
    await AsyncStorage.removeItem("fitai_guest");
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
    <AuthContext.Provider value={{ user, isLoading, isGuest, login, register, logout, continueAsGuest, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
