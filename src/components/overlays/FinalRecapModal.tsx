"use client";

import React, { useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { brand } from "@/config/brand";
import confetti from "canvas-confetti";
import { Check, Sparkles, BookOpen, RefreshCw, Trophy, ArrowRight, X } from "lucide-react";

export const FinalRecapModal: React.FC = () => {
  const { saveState, setOverlay, resetJourney, dismissCurrentDayModal } = useGame();

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#C9472F", "#14707A", "#F2B544", "#4C7A4F"],
      });
    } catch {
      // Ignore in non-browser env
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-scrim backdrop-blur-xs select-none animate-fadeIn">
      <div className="w-full max-w-4xl paper-glass-strong rounded-3xl border border-line shadow-e2 p-6 sm:p-8 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="text-center pb-4 mb-4 border-b border-line relative">
          <div className="w-12 h-12 rounded-full bg-sun/20 text-sun mx-auto mb-2 flex items-center justify-center">
            <Trophy size={26} className="text-sun" />
          </div>
          <span className="text-xs font-bold text-coral uppercase tracking-wider block mb-1">
            {brand.tagline}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink">
            {saveState.targetLanguage === "fr"
              ? "Your Seven Days in Valmer"
              : saveState.targetLanguage === "es"
              ? "Tus Siete Días en San Pedro"
              : saveState.targetLanguage === "it"
              ? "I Tuoi Sette Giorni a Bellavita"
              : "Your Seven Days in Town"}
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1">
            You've completed the full narrative journey from arrival to independent everyday life.
          </p>
          <button
            onClick={() => dismissCurrentDayModal()}
            className="absolute top-0 right-0 p-2 rounded-full text-muted hover:text-ink hover:bg-sand transition-colors cursor-pointer pointer-events-auto"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* 7 Sage Nodes Strip */}
        <div className="flex items-center justify-center gap-2 py-2 mb-4 bg-sage/10 rounded-2xl border border-sage/20">
          {[1, 2, 3, 4, 5, 6, 7].map((num, i) => (
            <React.Fragment key={num}>
              {i > 0 && <div className="h-0.5 w-3 bg-sage/50" />}
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-sage text-paper flex items-center justify-center text-xs font-bold shadow-xs">
                  <Check size={13} strokeWidth={3} />
                </div>
                <span className="text-[10px] font-bold text-ink">Day {num}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* 3 Columns */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4 pr-1 text-xs mb-4">
          {/* Col 1: Things you can now do */}
          <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs">
            <span className="font-bold text-ink uppercase tracking-wider block mb-2.5 text-[10px]">
              Things You Can Now Do
            </span>
            <div className="space-y-2">
              {[
                "Introduce yourself and meet new neighbours",
                "Buy groceries and ask prices with polite phrasing",
                "Ask for public transit directions and buy a ticket",
                "Order coffee and pastries at a local café terrace",
                "Explain an everyday household problem",
                "Hold casual social conversations at gatherings",
                "Handle multi-step daily errands independently",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-sage text-paper flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span className="text-ink font-medium leading-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: Language collected */}
          <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <span className="font-bold text-ink uppercase tracking-wider block mb-2.5 text-[10px]">
                Language You've Collected
              </span>
              <div className="p-3 rounded-xl bg-sand/40 border border-line mb-3">
                <span className="text-2xl font-bold font-display text-coral block">
                  {saveState.savedPhrases.length} expressions
                </span>
                <span className="text-[11px] text-muted">
                  Recorded in your personal journal across 5 neighbourhood locations.
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-ink">
                  <span>Dialogues completed:</span>
                  <span className="px-2 py-0.5 rounded-full bg-sand font-bold">
                    {saveState.conversationHistory.length}
                  </span>
                </div>
                <div className="flex items-center justify-between font-semibold text-ink">
                  <span>Comfortable phrases:</span>
                  <span className="px-2 py-0.5 rounded-full bg-sage/20 text-sage font-bold">
                    {saveState.savedPhrases.filter((p) => p.status === "comfortable").length}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setOverlay("journal")}
              className="mt-3 w-full py-2 rounded-xl bg-sand hover:bg-sand/80 text-ink font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <BookOpen size={14} />
              <span>Browse Journal</span>
            </button>
          </div>

          {/* Col 3: Keep practising & honesty note */}
          <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <span className="font-bold text-ink uppercase tracking-wider block mb-2 text-[10px]">
                Keep Practising
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-muted leading-relaxed mb-3">
                <li>Polite requests ("Je voudrais...", "Quisiera...")</li>
                <li>Sharing your opinions at social gatherings</li>
                <li>Listening to native speakers at natural speed</li>
                <li>Everyday problem descriptions</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-sand/30 border border-line text-[11px] text-muted italic">
              "Seven days builds a strong foundation, not instant fluency. Keep living the experience!"
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-auto">
          <button
            onClick={() => dismissCurrentDayModal()}
            className="text-xs text-muted hover:text-ink font-semibold cursor-pointer underline-offset-2 hover:underline"
          >
            Explore the town freely
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm("Start a new journey with a clean slate?")) {
                  dismissCurrentDayModal();
                  resetJourney();
                }
              }}
              className="px-4 py-2.5 rounded-xl border border-line bg-paper hover:bg-sand text-ink text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Replay journey</span>
            </button>
            <button
              onClick={() => {
                dismissCurrentDayModal();
                setOverlay("settings");
              }}
              className="px-5 py-2.5 rounded-xl bg-coral text-paper text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              Practise in a new language
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
