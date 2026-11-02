"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { Logo } from "@/components/brand/Logo";
import { Check } from "lucide-react";

export const JourneyStrip: React.FC = () => {
  const { saveState, setOverlay, jumpToDay } = useGame();
  const currentDay = saveState.currentDay;
  const currentScenario = saveState.scenarios[currentDay];

  return (
    <div
      onClick={() => setOverlay("journey")}
      className="cursor-pointer group inline-flex max-w-full items-center gap-1.5 px-2 py-1.5 sm:gap-3 sm:px-3.5 sm:py-2 rounded-2xl paper-glass hover:shadow-md transition-all select-none"
      title="Click to view full 7-day Journey map"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setOverlay("journey");
      }}
    >
      <span className="hidden sm:inline-flex">
        <Logo variant="mark" size={26} />
      </span>

      {/* 7 Progress Nodes */}
      <div className="hidden sm:flex items-center gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7].map((dayNum, idx) => {
          const isDone = saveState.completedDays.includes(dayNum);
          const isCurrent = dayNum === currentDay;

          return (
            <React.Fragment key={dayNum}>
              {idx > 0 && (
                <div
                  className={`h-0.5 w-2.5 rounded-full transition-colors ${
                    isDone ? "bg-sage" : "bg-sand"
                  }`}
                />
              )}
              {isDone ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    jumpToDay(dayNum);
                  }}
                  className="w-5 h-5 rounded-full bg-sage text-paper flex items-center justify-center text-[10px] font-bold shadow-xs hover:scale-110 active:scale-95 transition-all"
                  title={`Switch to completed Day ${dayNum}`}
                >
                  <Check size={12} strokeWidth={3} />
                </button>
              ) : isCurrent ? (
                <div
                  className="w-6 h-6 rounded-full bg-coral text-paper flex items-center justify-center text-xs font-bold ring-2 ring-sun shadow-sm"
                  title={`Day ${dayNum} current`}
                >
                  {dayNum}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    jumpToDay(dayNum);
                  }}
                  className="w-4 h-4 rounded-full border border-muted/40 text-muted/80 flex items-center justify-center text-[10px] font-medium hover:bg-sand/70 hover:scale-110 active:scale-95 transition-all"
                  title={`Switch to Day ${dayNum}`}
                >
                  {dayNum}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="hidden sm:block h-4 w-px bg-line" />

      {/* Title */}
      <div className="min-w-0 text-[11px] sm:text-xs font-semibold text-ink group-hover:text-coral transition-colors flex items-center gap-1">
        <span className="truncate max-w-[105px] sm:max-w-none">{currentScenario?.chapterTitle || `Day ${currentDay}`}</span>
        <span className="text-muted text-[10px]">▾</span>
      </div>
    </div>
  );
};
