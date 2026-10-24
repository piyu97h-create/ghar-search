"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthToast() {
  const { toastMessage } = useAuth();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0f1015]/95 backdrop-blur-xl border border-emerald-500/30 text-white shadow-[0_12px_40px_rgba(0,0,0,0.85)] ring-1 ring-emerald-500/20">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono tracking-wider text-emerald-400 uppercase">
                Ghar Search Auth
              </div>
              <div className="text-xs font-medium text-white/90 truncate">
                {toastMessage}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
