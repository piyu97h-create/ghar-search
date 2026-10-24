"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Sparkles,
  Building2,
  Briefcase,
  Globe2,
} from "lucide-react";
import { useAuth, User } from "@/context/AuthContext";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    loginWithOAuth,
    loginWithEmail,
    signupWithEmail,
    isLoading,
  } = useAuth();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [persona, setPersona] = useState<User["persona"]>("First-time Homebuyer");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === "login";

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = getPasswordStrength();

  const handleOAuth = async (provider: "google" | "github") => {
    setErrorMessage(null);
    setOauthLoading(provider);
    try {
      await loginWithOAuth(provider);
    } catch {
      setErrorMessage(`Failed to authenticate with ${provider}. Please try again.`);
    } finally {
      setOauthLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isLogin) {
      if (!email || !password) {
        setErrorMessage("Please enter both email and password.");
        return;
      }
      const res = await loginWithEmail(email, password);
      if (!res.success) {
        setErrorMessage(res.error || "Login failed.");
      }
    } else {
      if (!name || !email || !password) {
        setErrorMessage("Please fill in all required fields.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters.");
        return;
      }
      const res = await signupWithEmail(name, email, password, persona);
      if (!res.success) {
        setErrorMessage(res.error || "Signup failed.");
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
          className="relative w-full max-w-lg bg-[#0c0d10] border border-white/10 rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.9)] overflow-hidden z-10"
        >
          {/* Subtle Ambient Top Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

          {/* Modal Header */}
          <div className="relative p-6 sm:p-8 pb-4 border-b border-white/[0.06] flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono tracking-wider text-emerald-300 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>RERA VERIFIED PORTAL • HACKIIITD</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {isLogin ? "Welcome back to Ghar Search" : "Create your Homebuyer Account"}
              </h2>
              <p className="text-xs text-white/50 mt-1">
                {isLogin
                  ? "Access your saved property audits, dispute logs & TinyFish sessions."
                  : "Protect your life savings with autonomous agent due-diligence."}
              </p>
            </div>

            <button
              onClick={closeAuthModal}
              className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8 pt-5 space-y-6">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  openAuthModal("login");
                }}
                className={`py-2 text-xs font-medium rounded-lg transition-all ${
                  isLogin
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  openAuthModal("signup");
                }}
                className={`py-2 text-xs font-medium rounded-lg transition-all ${
                  !isLogin
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* OAuth Buttons (Google & GitHub) */}
            <div className="space-y-2.5">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleOAuth("google")}
                disabled={isLoading || oauthLoading !== null}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-medium text-xs sm:text-sm transition-all hover:border-white/20 active:scale-[0.99] disabled:opacity-50"
              >
                {oauthLoading === "google" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>
                  {oauthLoading === "google"
                    ? "Connecting to Google..."
                    : `${isLogin ? "Sign in" : "Sign up"} with Google`}
                </span>
              </button>

              {/* GitHub Button */}
              <button
                type="button"
                onClick={() => handleOAuth("github")}
                disabled={isLoading || oauthLoading !== null}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-medium text-xs sm:text-sm transition-all hover:border-white/20 active:scale-[0.99] disabled:opacity-50"
              >
                {oauthLoading === "github" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                ) : (
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                )}
                <span>
                  {oauthLoading === "github"
                    ? "Connecting to GitHub..."
                    : `${isLogin ? "Sign in" : "Sign up"} with GitHub`}
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/[0.08] w-full" />
              <span className="bg-[#0c0d10] px-3 text-[10px] font-mono tracking-wider text-white/40 uppercase">
                Or Continue With Email
              </span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-mono text-white/60 mb-1.5">
                    FULL NAME
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Piyush Gautam"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-emerald-500/60 focus:bg-white/[0.06] transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-white/60 mb-1.5">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-emerald-500/60 focus:bg-white/[0.06] transition-colors"
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-mono text-white/60 mb-1.5">
                    YOUR BUYER PERSONA
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <select
                      value={persona}
                      onChange={(e) => setPersona(e.target.value as User["persona"])}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#14151a] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/60 transition-colors cursor-pointer appearance-none"
                    >
                      <option value="First-time Homebuyer">First-time Homebuyer (Residential)</option>
                      <option value="NRI Real Estate Investor">NRI Real Estate Investor</option>
                      <option value="Legal Due-Diligence Auditor">Legal & Regulatory Auditor</option>
                      <option value="Channel Partner">Channel Partner / Broker</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono text-white/60">PASSWORD</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => alert("Password reset link has been dispatched to your email address.")}
                      className="text-[11px] font-mono text-emerald-400/80 hover:text-emerald-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-emerald-500/60 focus:bg-white/[0.06] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator (Signup only) */}
                {!isLogin && password && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex gap-1 h-1">
                      <div
                        className={`flex-1 rounded-full transition-all ${
                          strength >= 1 ? "bg-red-500" : "bg-white/10"
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full transition-all ${
                          strength >= 2 ? "bg-amber-500" : "bg-white/10"
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full transition-all ${
                          strength >= 3 ? "bg-emerald-500" : "bg-white/10"
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full transition-all ${
                          strength >= 4 ? "bg-emerald-400" : "bg-white/10"
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-white/40">
                      Strength:{" "}
                      {strength < 2
                        ? "Weak"
                        : strength < 3
                        ? "Moderate"
                        : strength < 4
                        ? "Strong"
                        : "Exceptional"}
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-emerald-400 text-black font-semibold text-xs sm:text-sm tracking-tight transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <>
                    <span>{isLogin ? "Sign In to Dashboard" : "Create Free Account"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Footer */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  HACKATHON QUICK-FILL DEMO:
                </span>
                <span className="text-emerald-400 font-semibold">1-CLICK</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleOAuth("google")}
                  className="py-1.5 px-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono tracking-tight text-center transition-colors truncate"
                >
                  Piyush (Google Demo)
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuth("github")}
                  className="py-1.5 px-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 text-[10px] font-mono tracking-tight text-center transition-colors truncate"
                >
                  Farhan (GitHub Demo)
                </button>
              </div>
            </div>

            {/* Privacy note */}
            <p className="text-[10px] text-center text-white/40 leading-relaxed">
              By continuing, you agree to Ghar Search&apos;s Terms of Service and Privacy Policy. All
              searches are cryptographically verified against state RERA databases.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
