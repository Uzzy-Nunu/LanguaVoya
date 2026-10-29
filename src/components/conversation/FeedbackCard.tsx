"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { audioService } from "@/lib/speech";
import { Check, Sparkles, Volume2, ArrowRight, X } from "lucide-react";

export const FeedbackCard: React.FC = () => {
  const { feedbackCard, dismissFeedbackCard, saveState } = useGame();
  if (!feedbackCard) return null;

  return (
    <div className="fixed top-20 right-6 z-40 w-[360px] max-w-[90vw] paper-glass-strong p-4 rounded-2xl shadow-e2 border border-line animate-slideInRight select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-line">
        <div className="flex items-center gap-1.5 font-bold text-ink text-sm">
          <Sparkles size={16} className="text-sun" />
          <span>{feedbackCard.title}</span>
        </div>
        <button
          onClick={dismissFeedbackCard}
          className="p-1 rounded-full text-muted hover:text-ink hover:bg-sand/60 transition-colors"
          aria-label="Dismiss feedback card"
        >
          <X size={15} />
        </button>
      </div>

      {/* Managed to */}
      <div className="mb-3">
        <span className="text-[10px] font-bold tracking-wider text-muted uppercase block mb-1">
          You managed to
        </span>
        <div className="space-y-1">
          {feedbackCard.managedLines.map((line, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-ink">
              <div className="w-4 h-4 rounded-full bg-sage text-paper flex items-center justify-center shrink-0">
                <Check size={10} strokeWidth={3} />
              </div>
              <span>{line}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Try this next time */}
      {feedbackCard.tips.length > 0 && (
        <div className="mb-3 bg-sun/15 border border-sun/30 rounded-xl p-2.5">
          <span className="text-[10px] font-bold tracking-wider text-ink/80 uppercase block mb-0.5">
            Try this next time
          </span>
          {feedbackCard.tips.map((tip, idx) => (
            <p key={idx} className="text-xs text-ink font-medium leading-relaxed">
              {tip}
            </p>
          ))}
        </div>
      )}

      {/* New Expressions */}
      {feedbackCard.newExpressions.length > 0 && (
        <div className="mb-3">
          <span className="text-[10px] font-bold tracking-wider text-muted uppercase block mb-1">
            New Expressions
          </span>
          <div className="space-y-1.5">
            {feedbackCard.newExpressions.map((expr, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-sand/50 rounded-xl px-2.5 py-1.5 text-xs border border-line/60"
              >
                <div>
                  <div className="font-semibold text-ink">{expr.text}</div>
                  <div className="text-[11px] text-muted">{expr.translation}</div>
                </div>
                <button
                  onClick={() => audioService.speak(expr.text, saveState.targetLanguage, saveState.settings.speechRate)}
                  className="p-1 text-lagoon hover:bg-paper rounded-full transition-colors shrink-0"
                  title="Listen"
                  aria-label={`Listen to ${expr.text}`}
                >
                  <Volume2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-line text-xs">
        <span className="text-muted text-[11px]">Saved to your journal</span>
        <button
          onClick={dismissFeedbackCard}
          className="px-3.5 py-1.5 rounded-full bg-coral text-paper font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-1 shadow-xs"
        >
          <span>Keep going</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
