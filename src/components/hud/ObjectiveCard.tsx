"use client";

import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Check, ChevronDown, ChevronUp, MapPin, Circle, ArrowRight } from "lucide-react";

export const ObjectiveCard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { saveState, advanceToNextDay } = useGame();
  const currentScenario = saveState.scenarios[saveState.currentDay];
  if (!currentScenario) return null;

  const currentTask = currentScenario.tasks.find((t) => t.status === "current");
  const allTasksDone =
    currentScenario.tasks.every((t) => t.status === "done" || t.status === "done-with-help") ||
    saveState.completedDays.includes(saveState.currentDay);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="paper-glass px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-ink shadow-sm hover:shadow-md transition-all select-none"
        aria-label="Expand goal"
      >
        <MapPin size={14} className="text-coral" />
        <span className="truncate max-w-[220px]">
          {currentTask ? currentTask.title : currentScenario.scenarioTitle}
        </span>
        <ChevronDown size={14} className="text-muted" />
      </button>
    );
  }

  return (
    <div className="w-[340px] max-w-[90vw] paper-glass p-3.5 rounded-2xl shadow-e1 select-none transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold tracking-wider text-muted uppercase">
          Today's Goal
        </span>
        <button
          onClick={() => setCollapsed(true)}
          className="text-muted hover:text-ink p-1 rounded-full hover:bg-sand/50 transition-colors"
          aria-label="Collapse objective card"
        >
          <ChevronUp size={15} />
        </button>
      </div>

      {/* Purpose */}
      <p className="text-sm font-semibold text-ink leading-snug mb-2.5">
        {currentScenario.whyItMatters}
      </p>

      {/* Current immediate action */}
      {currentTask && (
        <div className="bg-sand/60 border border-line rounded-xl px-2.5 py-1.5 mb-2.5 flex items-start gap-2">
          <MapPin size={14} className="text-coral shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-coral block">Next action</span>
            <span className="text-ink font-medium">{currentTask.title}</span>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-1.5">
        {currentScenario.tasks.map((task) => {
          const isDone = task.status === "done" || task.status === "done-with-help";
          const isCurrent = task.status === "current";

          return (
            <div
              key={task.id}
              className={`flex items-center gap-2 text-xs rounded-lg px-2 py-1 transition-colors ${
                isCurrent ? "bg-coral/10 font-medium text-ink" : "text-muted"
              }`}
            >
              {isDone ? (
                <div className="w-4 h-4 rounded-full bg-sage text-paper flex items-center justify-center shrink-0">
                  <Check size={10} strokeWidth={3} />
                </div>
              ) : isCurrent ? (
                <div className="w-4 h-4 rounded-full bg-coral text-paper flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-paper" />
                </div>
              ) : (
                <Circle size={14} className="text-muted/40 shrink-0" />
              )}
              <span className={`truncate ${isDone ? "line-through text-muted" : ""}`}>
                {task.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Advance to next level / day action */}
      {allTasksDone && saveState.currentDay < 7 && (
        <button
          onClick={advanceToNextDay}
          className="w-full mt-3 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Begin Day {saveState.currentDay + 1}</span>
          <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
};
