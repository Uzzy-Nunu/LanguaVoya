"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { HINTS_BY_TASK } from "@/data/dialogueBank";
import { Lightbulb, MessageSquare, Globe, ArrowRight, X } from "lucide-react";

interface HintLadderProps {
  onInsertReply: (text: string) => void;
  onClose: () => void;
}

export const HintLadder: React.FC<HintLadderProps> = ({ onInsertReply, onClose }) => {
  const { saveState, activeConversation, setHintLevel } = useGame();
  const currentScenario = saveState.scenarios[saveState.currentDay];
  const currentTask = currentScenario?.tasks.find((t) => t.status === "current");
  const targetLang = saveState.targetLanguage;

  const hintData =
    (currentTask && HINTS_BY_TASK[currentTask.id]?.[targetLang]) ||
    HINTS_BY_TASK["d1-t1"]?.[targetLang] ||
    HINTS_BY_TASK["d1-t1"]["fr"];

  const currentLevel = activeConversation?.hintLevel || 1;

  return (
    <div className="w-full bg-paper/95 border border-line rounded-2xl p-3 shadow-md mb-2 text-xs select-none animate-fadeIn">
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-line">
        <div className="flex items-center gap-1.5 font-bold text-ink">
          <Lightbulb size={15} className="text-sun" />
          <span>Need a nudge? Asking for help never penalises your journey.</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-muted hover:text-ink hover:bg-sand transition-colors"
          aria-label="Close hints (H or Esc)"
        >
          <X size={14} />
        </button>
      </div>

      <div className="space-y-2">
        {/* Step 1: Clue */}
        <div className="bg-sand/40 border border-line/60 rounded-xl p-2.5">
          <div className="flex items-center gap-1.5 font-bold text-ink mb-1">
            <span className="w-4 h-4 rounded-full bg-sun text-ink flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Clue</span>
          </div>
          <p className="text-muted leading-relaxed">{hintData.steps[0].clue}</p>
        </div>

        {/* Step 2: Phrase Fragments */}
        {currentLevel >= 2 ? (
          <div className="bg-sand/40 border border-line/60 rounded-xl p-2.5 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold text-ink mb-1.5">
              <span className="w-4 h-4 rounded-full bg-lagoon text-paper flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Phrases & Vocabulary</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {hintData.steps[1]?.phrases?.map((ph, idx) => (
                <button
                  key={idx}
                  onClick={() => onInsertReply(ph)}
                  className="px-2.5 py-1 rounded-full bg-paper border border-line hover:border-lagoon hover:text-lagoon text-ink font-medium transition-colors"
                  title="Click to insert phrase"
                >
                  {ph}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setHintLevel(2)}
            className="w-full py-1.5 px-2 rounded-xl border border-dashed border-line text-muted hover:text-ink hover:bg-sand/30 font-medium text-left flex items-center justify-between"
          >
            <span>② Show useful phrase fragments</span>
            <span className="text-[11px] text-lagoon font-semibold">Reveal →</span>
          </button>
        )}

        {/* Step 3: Full Model Reply & Translation */}
        {currentLevel >= 3 ? (
          <div className="bg-sand/40 border border-line/60 rounded-xl p-2.5 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold text-ink mb-1">
              <span className="w-4 h-4 rounded-full bg-coral text-paper flex items-center justify-center text-[10px]">
                3
              </span>
              <span>Full Translation & Model Reply</span>
            </div>
            <div className="text-muted italic mb-1.5">
              "{hintData.steps[2]?.translation}"
            </div>
            <div className="flex items-center justify-between gap-2 bg-paper rounded-lg p-2 border border-line">
              <span className="font-semibold text-ink text-xs">
                {hintData.steps[2]?.modelReply}
              </span>
              <button
                onClick={() => {
                  if (hintData.steps[2]?.modelReply) {
                    onInsertReply(hintData.steps[2].modelReply);
                  }
                }}
                className="px-2.5 py-1 rounded-full bg-coral text-paper font-bold hover:scale-105 active:scale-95 transition-all text-[11px] shrink-0 flex items-center gap-1"
              >
                <span>Use this</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ) : currentLevel >= 2 ? (
          <button
            onClick={() => setHintLevel(3)}
            className="w-full py-1.5 px-2 rounded-xl border border-dashed border-line text-muted hover:text-ink hover:bg-sand/30 font-medium text-left flex items-center justify-between"
          >
            <span>③ Show complete translation and model sentence</span>
            <span className="text-[11px] text-coral font-semibold">Reveal →</span>
          </button>
        ) : null}
      </div>
    </div>
  );
};
