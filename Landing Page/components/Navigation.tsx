"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowUpRight,
  Volume2,
  VolumeX,
  ShieldCheck,
  Search,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import UserDropdown from "@/components/auth/UserDropdown";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-4 transition-all duration-500">
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-6 py-3 rounded-full transition-all duration-500 ${
          isScrolled
            ? "bg-[#0a0a0c]/85 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.85)]"
            : "bg-black/30 backdrop-blur-sm border border-white/[0.06]"
        }`}
      >
        {/* Brand Logo & Hackathon Tag */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold tracking-tight text-xs group-hover:bg-emerald-500 group-hover:text-black transition-colors duration-300">
            <Search className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-white/95 group-hover:text-white">
                Ghar Search
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                HACKIIITD 2026
              </span>
            </div>
            <span className="text-[9px] font-mono tracking-wider text-white/40">
              Agentic Due-Diligence Layer • TinyFish
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-mono tracking-wider text-white/60">
          <a
            href="#problem"
            className="hover:text-white transition-colors duration-200"
          >
            01 // Problem
          </a>
          <a
            href="#solution"
            className="hover:text-white transition-colors duration-200"
          >
            02 // Solution
          </a>
          <a
            href="#live-verdict"
            className="hover:text-emerald-400 text-white/80 transition-colors duration-200 flex items-center gap-1.5 font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            03 // Live Prototype
          </a>
          <a
            href="#pipeline"
            className="hover:text-white transition-colors duration-200"
          >
            04 // Architecture
          </a>
          <a
            href="#tinyfish"
            className="hover:text-white transition-colors duration-200"
          >
            05 // TinyFish
          </a>
          <a
            href="#team"
            className="hover:text-white transition-colors duration-200"
          >
            06 // Team
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Ambient Audio Indicator */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all text-[10px] font-mono"
            title={isMuted ? "Audio muted" : "Audio active"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3 h-3" />
                <span>AUDIO OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span className="text-white/80">AUDIO ON</span>
              </>
            )}
          </button>

          {/* Authentication Section */}
          {isAuthenticated ? (
            <UserDropdown />
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-xs font-medium text-white transition-all hover:border-emerald-500/40"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Register</span>
              </button>
            </div>
          )}

          {/* Test Live Prototype CTA */}
          <a
            href="#live-verdict"
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-white text-black text-xs font-semibold tracking-tight hover:bg-emerald-400 hover:text-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Verify Listing</span>
            <span className="xs:hidden sm:hidden">Verify</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white/80 hover:text-white"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="lg:hidden mt-3 mx-2 p-5 rounded-3xl bg-[#0a0a0c]/95 backdrop-blur-2xl border border-white/10 flex flex-col gap-3 text-xs font-mono tracking-widest uppercase text-white/70"
          >
            {/* Authenticated user mobile banner */}
            {isAuthenticated && user && (
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-400/50"
                  />
                  <div>
                    <div className="font-semibold text-white tracking-normal lowercase capitalize text-xs">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-white/40 tracking-normal font-mono">
                      {user.email}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal("login");
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white text-black font-semibold text-xs text-center uppercase tracking-wider"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal("signup");
                  }}
                  className="py-2.5 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold text-xs text-center uppercase tracking-wider"
                >
                  Create Account
                </button>
              </div>
            )}

            <a
              href="#problem"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-white"
            >
              01 // The Problem
            </a>
            <a
              href="#solution"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-white"
            >
              02 // Proposed Solution
            </a>
            <a
              href="#live-verdict"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-emerald-400 hover:text-white"
            >
              03 // Live Prototype
            </a>
            <a
              href="#pipeline"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-white"
            >
              04 // 5-Layer Pipeline
            </a>
            <a
              href="#tinyfish"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-white"
            >
              05 // TinyFish Integration
            </a>
            <a
              href="#team"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-white"
            >
              06 // Team Details
            </a>

            <div className="pt-3 border-t border-white/10">
              <a
                href="#live-verdict"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-wider"
              >
                <span>Verify Listing Now</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

