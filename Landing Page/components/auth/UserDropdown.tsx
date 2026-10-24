"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  LogOut,
  ShieldCheck,
  FileText,
  Key,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Bookmark,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function UserDropdown() {
  const { user, logout, showToast } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all text-xs text-white group"
      >
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-400/60"
          />
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-black" />
        </div>
        <span className="font-medium text-xs tracking-tight max-w-[100px] truncate text-white/90 group-hover:text-white">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-white" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0f1015] border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.85)] p-2 z-50 overflow-hidden"
          >
            {/* Header Profile Info */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-2">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs text-white truncate">{user.name}</span>
                    {user.verifiedBuyer && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-white/50 truncate block">
                    {user.email}
                  </span>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                      {user.provider === "google"
                        ? "Google Auth"
                        : user.provider === "github"
                        ? "GitHub Auth"
                        : "Email Auth"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Persona Tag */}
              <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-white/50">
                <span>ROLE:</span>
                <span className="text-white/80 font-medium">{user.persona}</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-1.5 px-1 py-1 mb-2 text-center">
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[10px] font-mono text-white/40">SAVED SEARCHES</div>
                <div className="text-sm font-bold text-white mt-0.5 font-mono">
                  {user.savedSearchesCount}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[10px] font-mono text-white/40">AUDIT REPORTS</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5 font-mono">
                  {user.reportsGenerated}
                </div>
              </div>
            </div>

            {/* Nav Items */}
            <div className="space-y-0.5 text-xs text-white/70">
              <a
                href="#live-verdict"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>My Due-Diligence Reports</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  showToast("TinyFish Agent API token: tf_live_2026_active");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors text-left"
              >
                <Key className="w-4 h-4 text-emerald-400" />
                <span>TinyFish API Credentials</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  showToast("Saved properties bookmarked to your local cache.");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors text-left"
              >
                <Bookmark className="w-4 h-4 text-emerald-400" />
                <span>Saved Listings (Shivalik Greens)</span>
              </button>
            </div>

            {/* Logout */}
            <div className="mt-2 pt-2 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors text-xs font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
