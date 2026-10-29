"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { Check, Sparkles, ArrowRight, BookOpen, Compass, X } from "lucide-react";

export const DaySummaryModal: React.FC = () => {
  const { saveState, startNextDay, setOverlay, dismissCurrentDayModal } = useGame();
  const currentDay = saveState.currentDay;
  const currentScenario = saveState.scenarios[currentDay];

  // If this is Day 7, FinalRecapModal takes over instead
  if (currentDay >= 7) return null;

  const phrasesFromToday = saveState.savedPhrases.filter((p) => p.sourceDay === currentDay);
  const doneTasks = currentScenario?.tasks.filter((t) => t.status === "done" || t.status === "done-with-help");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-scrim backdrop-blur-xs select-none animate-fadeIn">
      <div className="w-full max-w-3xl paper-glass-strong rounded-3xl border border-line shadow-e2 p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Banner */}
        <div className="text-center pb-4 mb-4 border-b border-line relative">
          <button
            onClick={() => dismissCurrentDayModal()}
            className="absolute top-0 right-0 p-2 rounded-full text-muted hover:text-ink hover:bg-sand transition-colors cursor-pointer pointer-events-auto"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage/20 text-sage text-xs font-bold uppercase tracking-wider mb-2">
            <Check size={14} strokeWidth={3} />
            <span>Day {currentDay} Complete</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink">
            {currentScenario?.scenarioTitle}
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1 max-w-lg mx-auto">
            {currentScenario?.teaser}
          </p>
        </div>

        {/* 3 Columns Summary */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4 pr-1 text-xs mb-4">
          {/* Col 1: What you did */}
          <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs">
            <span className="font-bold text-ink uppercase tracking-wider block mb-2 text-[10px]">
              What You Did
            </span>
            <div className="space-y-1.5">
              {doneTasks?.map((task) => (
                <div key={task.id} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-sage text-paper flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span className="text-ink font-medium">{task.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: What you said */}
          <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs">
            <span className="font-bold text-ink uppercase tracking-wider block mb-2 text-[10px]">
              What You Said
            </span>
            <div className="space-y-2 italic text-muted">
              {phrasesFromToday.length > 0 ? (
                phrasesFromToday.slice(0, 3).map((p) => (
                  <div key={p.id} className="border-l-2 border-coral pl-2">
                    <span className="text-ink font-semibold not-italic block">"{p.phraseText}"</span>
                    <span className="text-[10px] text-muted">{p.translation}</span>
                  </div>
                ))
              ) : (
                <p>Spoke and engaged with neighbours in town.</p>
              )}
            </div>
          </div>

          {/* Col 3: New in your journal */}
          <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <span className="font-bold text-ink uppercase tracking-wider block mb-2 text-[10px]">
                New in your journal
              </span>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-ink font-semibold">
                  <span>Collected phrases:</span>
                  <span className="px-2 py-0.5 rounded-full bg-sand font-bold">{phrasesFromToday.length}</span>
                </div>
                <div className="flex items-center justify-between text-ink font-semibold">
                  <span>Needs practice:</span>
                  <span className="px-2 py-0.5 rounded-full bg-sun/20 font-bold">
                    {phrasesFromToday.filter((p) => p.status === "needs-practice").length}
                  </span>
                </div>
              </div>
            </div>

            {/* Unlocks */}
            {currentScenario?.unlockMessage && (
              <div className="mt-3 p-2.5 rounded-xl bg-lagoon/10 border border-lagoon/30 text-[11px] text-ink">
                <span className="font-bold text-lagoon block mb-0.5 flex items-center gap-1">
                  <Sparkles size={12} />
                  <span>The Town Opens Up</span>
                </span>
                <p>{currentScenario.unlockMessage}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-auto">
          <button
            onClick={() => {
              dismissCurrentDayModal();
              setOverlay("journal");
            }}
            className="text-xs text-muted hover:text-ink font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen size={14} />
            <span>Open your journal</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => dismissCurrentDayModal()}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-sand/60 hover:bg-sand text-ink text-xs font-semibold transition-colors cursor-pointer"
            >
              Stay in neighbourhood
            </button>
            <button
              onClick={startNextDay}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-coral text-paper text-xs font-bold hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Begin Day {currentDay + 1}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
