"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: "google" | "github" | "email";
  persona: "First-time Homebuyer" | "NRI Real Estate Investor" | "Legal Due-Diligence Auditor" | "Channel Partner";
  verifiedBuyer: boolean;
  savedSearchesCount: number;
  reportsGenerated: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "signup";
  openAuthModal: (mode?: "login" | "signup") => void;
  closeAuthModal: () => void;
  loginWithOAuth: (provider: "google" | "github") => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signupWithEmail: (name: string, email: string, pass: string, persona: User["persona"]) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_GOOGLE_USER: User = {
  id: "usr_g_98241",
  name: "Piyush Gautam",
  email: "piyush.gautam@gmail.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  provider: "google",
  persona: "First-time Homebuyer",
  verifiedBuyer: true,
  savedSearchesCount: 4,
  reportsGenerated: 12,
  createdAt: "2026-03-15",
};

const DEMO_GITHUB_USER: User = {
  id: "usr_gh_11029",
  name: "Farhan Mallik",
  email: "farhan.mallik@github.com",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
  provider: "github",
  persona: "Legal Due-Diligence Auditor",
  verifiedBuyer: true,
  savedSearchesCount: 9,
  reportsGenerated: 28,
  createdAt: "2026-01-20",
};

const STORAGE_KEY = "ghar_search_user_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load user session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load user session from localStorage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const openAuthModal = (mode: "login" | "signup" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginWithOAuth = async (provider: "google" | "github") => {
    setIsLoading(true);
    // Simulate real OAuth handshake latency
    await new Promise((r) => setTimeout(r, 900));

    const selectedUser = provider === "google" ? DEMO_GOOGLE_USER : DEMO_GITHUB_USER;
    setUser(selectedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedUser));
    setIsLoading(false);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${selectedUser.name}! Signed in via ${provider === "google" ? "Google" : "GitHub"}.`);
  };

  const loginWithEmail = async (email: string, _pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    if (!email || !email.includes("@")) {
      setIsLoading(false);
      return { success: false, error: "Please provide a valid email address." };
    }

    const nameFromEmail = email.split("@")[0].replace(/[\._]/g, " ");
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

    const emailUser: User = {
      id: `usr_em_${Date.now()}`,
      name: formattedName || "Homebuyer Member",
      email: email.toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
      provider: "email",
      persona: "First-time Homebuyer",
      verifiedBuyer: true,
      savedSearchesCount: 1,
      reportsGenerated: 3,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setUser(emailUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emailUser));
    setIsLoading(false);
    setIsAuthModalOpen(false);
    showToast(`Signed in successfully as ${emailUser.email}`);
    return { success: true };
  };

  const signupWithEmail = async (
    name: string,
    email: string,
    _pass: string,
    persona: User["persona"]
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (!name.trim()) {
      setIsLoading(false);
      return { success: false, error: "Please enter your full name." };
    }
    if (!email || !email.includes("@")) {
      setIsLoading(false);
      return { success: false, error: "Please provide a valid email address." };
    }

    const newUser: User = {
      id: `usr_new_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
      provider: "email",
      persona: persona || "First-time Homebuyer",
      verifiedBuyer: false,
      savedSearchesCount: 0,
      reportsGenerated: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setIsLoading(false);
    setIsAuthModalOpen(false);
    showToast(`Welcome to Ghar Search, ${newUser.name}! Your account is ready.`);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    showToast("You have been signed out successfully.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        loginWithOAuth,
        loginWithEmail,
        signupWithEmail,
        logout,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
