"use client";

import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { SCENARIOS } from "@/data/scenarios";
import { Check, MapPin, X, ArrowRight, Circle, Sparkles } from "lucide-react";

export const JourneyModal: React.FC = () => {
  const { saveState, setOverlay, endCurrentDay, startNextDay, jumpToDay } = useGame();
  const [selectedDay, setSelectedDay] = useState(saveState.currentDay);

  const scenario = SCENARIOS[selectedDay] || SCENARIOS[1];
  const isCurrentDay = selectedDay === saveState.currentDay;
  const isDoneDay = saveState.completedDays.includes(selectedDay);

  // Check if all tasks in current day are finished
  const currentScenarioState = saveState.scenarios[saveState.currentDay];
  const allCurrentTasksDone = currentScenarioState?.tasks.every(
    (t) => t.status === "done" || t.status === "done-with-help"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim backdrop-blur-xs select-none animate-fadeIn">
      <div className="w-full max-w-4xl paper-glass-strong rounded-3xl border border-line shadow-e2 p-5 sm:p-7 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-line">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-muted uppercase">
              Your 7-Day Narrative Journey
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-ink">
              {saveState.targetLanguage === "fr"
                ? "Your week in Valmer"
                : saveState.targetLanguage === "es"
                ? "Tu semana en San Pedro"
                : saveState.targetLanguage === "it"
                ? "La tua settimana a Bellavita"
                : "Your week in Lilac Town"}
            </h2>
          </div>
          <button
            onClick={() => setOverlay(null)}
            className="p-2 rounded-full text-muted hover:text-ink hover:bg-sand/80 transition-colors"
            aria-label="Close journey (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* 7-Day Nodes Strip */}
        <div className="py-2 px-3 bg-sand/40 border border-line rounded-2xl mb-4 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[580px] gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
              const done = saveState.completedDays.includes(dayNum);
              const current = dayNum === saveState.currentDay;
              const isSelected = dayNum === selectedDay;

              return (
                <button
                  key={dayNum}
                  onClick={() => {
                    setSelectedDay(dayNum);
                    jumpToDay(dayNum);
                  }}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                    isSelected ? "bg-paper shadow-sm scale-105" : "hover:bg-sand/60 opacity-80"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      done
                        ? "bg-sage text-paper"
                        : current
                        ? "bg-coral text-paper ring-4 ring-sun"
                        : "border-2 border-line text-muted bg-paper/50"
                    }`}
                  >
                    {done ? <Check size={16} strokeWidth={3} /> : dayNum}
                  </div>
                  <span className="text-[11px] font-semibold text-ink whitespace-nowrap">
                    Day {dayNum}
                  </span>
                  <span className="text-[10px] text-muted">
                    {done ? "Completed" : current ? "Current" : "Upcoming"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Detail Card */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-5 pr-1">
          {/* Left 2 Cols: Scenario info & tasks */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-xs font-bold text-coral uppercase tracking-wider block">
                {scenario.chapterTitle}
              </span>
              <h3 className="text-lg font-bold text-ink mb-1">{scenario.scenarioTitle}</h3>
              <p className="text-sm text-muted leading-relaxed">{scenario.whyItMatters}</p>
            </div>

            {/* Task list for this scenario */}
            <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs">
              <span className="text-xs font-bold text-ink uppercase tracking-wider block mb-2">
                Scenario Objectives
              </span>
              <div className="space-y-2">
                {scenario.tasks.map((task) => {
                  const isDone =
                    isDoneDay ||
                    (isCurrentDay &&
                      (saveState.scenarios[saveState.currentDay]?.tasks.find((t) => t.id === task.id)?.status === "done" ||
                        saveState.scenarios[saveState.currentDay]?.tasks.find((t) => t.id === task.id)?.status === "done-with-help"));
                  const isCurrent =
                    isCurrentDay &&
                    saveState.scenarios[saveState.currentDay]?.tasks.find((t) => t.id === task.id)?.status === "current";

                  return (
                    <div
                      key={task.id}
                      className={`flex items-start gap-2.5 p-2 rounded-xl text-xs ${
                        isCurrent ? "bg-coral/10 font-medium text-ink" : "text-muted"
                      }`}
                    >
                      {isDone ? (
                        <div className="w-4 h-4 rounded-full bg-sage text-paper flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full bg-coral text-paper flex items-center justify-center shrink-0 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-paper" />
                        </div>
                      ) : (
                        <Circle size={14} className="text-muted/40 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className={`font-semibold ${isDone ? "line-through text-muted" : "text-ink"}`}>
                          {task.title}
                        </div>
                        <div className="text-[11px] text-muted">{task.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Col: Vocabulary & Progression */}
          <div className="space-y-4">
            {/* Words you'll want */}
            <div className="bg-sand/40 border border-line rounded-2xl p-4">
              <span className="text-xs font-bold text-ink uppercase tracking-wider block mb-2">
                Words You'll Want
              </span>
              <div className="flex flex-wrap gap-1.5">
                {scenario.keyWords.map((word, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full bg-paper border border-line text-xs font-medium text-ink"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* Unlocks */}
            {scenario.unlockMessage && (
              <div className="bg-lagoon/10 border border-lagoon/30 rounded-2xl p-3.5 text-xs text-ink">
                <span className="font-bold text-lagoon block mb-1 flex items-center gap-1">
                  <Sparkles size={14} />
                  <span>World Unlock</span>
                </span>
                <p>{scenario.unlockMessage}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-2">
              {isCurrentDay ? (
                allCurrentTasksDone ? (
                  <button
                    onClick={() => {
                      endCurrentDay();
                      setOverlay(null);
                    }}
                    className="w-full py-3 rounded-xl bg-sage text-paper font-bold hover:scale-105 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Check size={16} />
                    <span>Complete Day {selectedDay} & Summary</span>
                  </button>
                ) : (
                  <button
                    onClick={() => jumpToDay(selectedDay)}
                    className="w-full py-3 rounded-xl bg-coral text-paper font-bold hover:scale-105 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Resume Day {selectedDay}</span>
                    <ArrowRight size={16} />
                  </button>
                )
              ) : (
                <button
                  onClick={() => setOverlay(null)}
                  className="w-full py-2.5 rounded-xl bg-paper border border-line text-ink font-semibold hover:bg-sand text-xs transition-colors"
                >
                  Resume Day {selectedDay}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
