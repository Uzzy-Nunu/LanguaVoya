"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { HelpCircle, Keyboard, MessageSquare, Compass, X } from "lucide-react";

export const HelpModal: React.FC = () => {
  const { setOverlay } = useGame();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim backdrop-blur-xs select-none animate-fadeIn">
      <div className="w-full max-w-2xl paper-glass-strong rounded-3xl border border-line shadow-e2 p-5 sm:p-7 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-line">
          <div className="flex items-center gap-2">
            <HelpCircle size={20} className="text-lagoon" />
            <h2 className="text-xl font-bold font-display text-ink">Controls & Gameplay Guide</h2>
          </div>
          <button
            onClick={() => setOverlay(null)}
            className="p-2 rounded-full text-muted hover:text-ink hover:bg-sand/80 transition-colors"
            aria-label="Close help"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Controls list */}
          <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs">
            <span className="font-bold text-ink uppercase tracking-wider block mb-3 flex items-center gap-1.5">
              <Keyboard size={15} className="text-coral" />
              <span>Movement & Interaction</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex items-center justify-between bg-sand/40 p-2.5 rounded-xl border border-line/60">
                <span className="text-ink font-medium">Walk to point</span>
                <span className="px-2 py-0.5 rounded bg-paper border border-line font-mono text-[11px] font-bold">
                  Click / Tap
                </span>
              </div>
              <div className="flex items-center justify-between bg-sand/40 p-2.5 rounded-xl border border-line/60">
                <span className="text-ink font-medium">Direct movement</span>
                <span className="px-2 py-0.5 rounded bg-paper border border-line font-mono text-[11px] font-bold">
                  WASD / Arrows
                </span>
              </div>
              <div className="flex items-center justify-between bg-sand/40 p-2.5 rounded-xl border border-line/60">
                <span className="text-ink font-medium">Talk to character</span>
                <span className="px-2 py-0.5 rounded bg-paper border border-line font-mono text-[11px] font-bold">
                  E / Click
                </span>
              </div>
              <div className="flex items-center justify-between bg-sand/40 p-2.5 rounded-xl border border-line/60">
                <span className="text-ink font-medium">Open Hint ladder</span>
                <span className="px-2 py-0.5 rounded bg-paper border border-line font-mono text-[11px] font-bold">
                  H
                </span>
              </div>
              <div className="flex items-center justify-between bg-sand/40 p-2.5 rounded-xl border border-line/60">
                <span className="text-ink font-medium">Open Journal</span>
                <span className="px-2 py-0.5 rounded bg-paper border border-line font-mono text-[11px] font-bold">
                  J
                </span>
              </div>
              <div className="flex items-center justify-between bg-sand/40 p-2.5 rounded-xl border border-line/60">
                <span className="text-ink font-medium">Close / Leave</span>
                <span className="px-2 py-0.5 rounded bg-paper border border-line font-mono text-[11px] font-bold">
                  Esc
                </span>
              </div>
            </div>
          </div>

          {/* Philosophy & tips */}
          <div className="bg-sand/40 border border-line rounded-2xl p-4">
            <span className="font-bold text-ink uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Compass size={15} className="text-lagoon" />
              <span>Language Learning Philosophy</span>
            </span>

            <div className="space-y-2 text-muted leading-relaxed">
              <p>
                <strong className="text-ink">1. Meaning before perfection: </strong>
                Communicate your intention! Minor grammatical slips won't block you from completing tasks.
              </p>
              <p>
                <strong className="text-ink">2. Hints never penalise: </strong>
                Asking for a clue, vocabulary, or full sentence translation is part of learning and does not reduce any score.
              </p>
              <p>
                <strong className="text-ink">3. Talk or type: </strong>
                Both voice input and keyboard text are first-class ways to play. You can edit voice transcripts at any time before sending.
              </p>
              <p>
                <strong className="text-ink">4. Your journal remembers for you: </strong>
                Every conversation and new phrase is saved automatically so you can focus on the scene.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
