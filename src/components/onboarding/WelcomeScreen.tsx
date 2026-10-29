"use client";

import React from "react";
import { brand } from "@/config/brand";
import { Logo } from "@/components/brand/Logo";
import { ArrowRight, Volume2, ShieldCheck, Sparkles } from "lucide-react";
import { AccountAccess } from "./AccountAccess";

interface WelcomeScreenProps {
  hasExistingSave: boolean;
  onBeginNew: () => void;
  onResume: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  hasExistingSave,
  onBeginNew,
  onResume,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-[#1C2A39] via-[#2A3B4C] to-[#14707A] text-paper select-none">
      <div className="w-full max-w-2xl paper-glass-strong rounded-3xl p-6 sm:p-10 text-ink shadow-e2 border border-line flex flex-col items-center text-center">
        {/* Brand Logo & Tagline */}
        <Logo variant="full" size={48} className="mb-4" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral/10 text-coral text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles size={13} />
          <span>Interactive 3D Language Journey</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-ink leading-tight mb-3">
          {brand.tagline}
        </h1>

        <p className="text-sm sm:text-base text-muted max-w-lg mb-6 leading-relaxed">
          Spend a self-paced week in a charming coastal neighbourhood where every conversation matters.
          Talk, explore in 3D, and settle in — one day at a time.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted mb-8">
          <span className="flex items-center gap-1 bg-sand/60 px-3 py-1.5 rounded-full border border-line">
            <Volume2 size={14} className="text-coral" />
            <span>Voice & Text parity</span>
          </span>
          <span className="flex items-center gap-1 bg-sand/60 px-3 py-1.5 rounded-full border border-line">
            <ShieldCheck size={14} className="text-lagoon" />
            <span>Meaning before perfection</span>
          </span>
          <span className="flex items-center gap-1 bg-sand/60 px-3 py-1.5 rounded-full border border-line">
            <span>7 Chapters · 5 Locations</span>
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
          {hasExistingSave && (
            <button
              onClick={onResume}
              className="w-full py-3.5 px-6 rounded-2xl bg-coral text-paper font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Continue Your Journey</span>
              <ArrowRight size={16} />
            </button>
          )}

          <button
            onClick={onBeginNew}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              hasExistingSave
                ? "bg-sand/80 hover:bg-sand text-ink border border-line"
                : "bg-coral text-paper shadow-md hover:scale-105 active:scale-95"
            }`}
          >
            <span>{hasExistingSave ? "Start New Journey" : "Begin Your Week"}</span>
            {!hasExistingSave && <ArrowRight size={16} />}
          </button>
        </div>

        <div className="w-full max-w-xl mt-5">
          <AccountAccess />
        </div>

        <div className="mt-5 text-[11px] text-muted">
          Guest play is always available · Sign in to sync progress and invite a tutor
        </div>
      </div>
    </div>
  );
};
