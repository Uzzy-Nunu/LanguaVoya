"use client";

import React, { useState, useRef, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { audioService } from "@/lib/speech";
import { HintLadder } from "./HintLadder";
import { VoiceRecorder } from "./VoiceRecorder";
import { getSuggestedResponses } from "@/data/dialogueBank";
import {
  Volume2,
  Globe,
  Sparkles,
  Lightbulb,
  Mic,
  Send,
  X,
  ArrowRight,
  Check,
} from "lucide-react";

export const DialogueDock: React.FC = () => {
  const {
    activeConversation,
    sendMessage,
    leaveConversation,
    advanceToNextDay,
    setHintLevel,
    saveState,
  } = useGame();

  const [inputText, setInputText] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "voice">(
    saveState.settings.voiceEnabled ? "voice" : "text"
  );
  const [showHintLadder, setShowHintLadder] = useState(false);
  const [showTranslations, setShowTranslations] = useState(saveState.settings.autoTranslate);
  const [expandedCorrectionId, setExpandedCorrectionId] = useState<string | null>(null);

  const turnsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    turnsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.turns]);

  const currentScenario = saveState.scenarios[saveState.currentDay];
  const currentTask = currentScenario?.tasks.find((t) => t.status === "current");
  const fallbackTaskId = currentScenario?.tasks[0]?.id || `d${saveState.currentDay}-t1`;
  const suggestions = getSuggestedResponses(currentTask?.id || fallbackTaskId, saveState.targetLanguage);

  const allTasksDone = currentScenario?.tasks.every((t) => t.status === "done" || t.status === "done-with-help");
  const playerTurnCount = activeConversation?.turns.filter((t) => t.speaker === "player").length || 0;
  const canAdvanceLevel = allTasksDone || playerTurnCount >= 2;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "h" && !e.ctrlKey && !e.metaKey) {
        if (document.activeElement?.tagName !== "INPUT") {
          e.preventDefault();
          setShowHintLadder((prev) => !prev);
          setHintLevel(1);
        }
      }
      if (e.key === "Escape") {
        if (showHintLadder) setShowHintLadder(false);
        else leaveConversation();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showHintLadder, leaveConversation, setHintLevel]);

  if (!activeConversation) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;
    setInputText("");
    await sendMessage(text, "text");
  };

  const handleInsertHintReply = (reply: string) => {
    setInputText(reply);
    setShowHintLadder(false);
    if (inputMode === "voice") setInputMode("text");
  };

  const lastNpcTurn = [...activeConversation.turns].reverse().find((t) => t.speaker === "npc");

  return (
    /* Side panel: right side, full height, doesn't cover the 3D scene on the left */
    <div className="fixed top-0 right-0 h-full w-[380px] max-w-[42vw] z-30 flex flex-col pointer-events-auto">
      <div className="m-3 mt-16 flex-1 flex flex-col paper-glass-strong rounded-2xl border border-line shadow-e2 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-line shrink-0 bg-paper/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-coral inline-block" />
            <span className="text-xs font-bold tracking-wider uppercase text-ink">
              {activeConversation.npcName}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {lastNpcTurn && (
              <>
                <button
                  onClick={() => audioService.speak(lastNpcTurn.text, saveState.targetLanguage, saveState.settings.speechRate)}
                  className="px-2 py-0.5 rounded-full hover:bg-sand/80 text-ink flex items-center gap-1 transition-colors text-[11px]"
                  title="Replay"
                >
                  <Volume2 size={13} className="text-coral" />
                  <span className="font-semibold">Replay</span>
                </button>
                <button
                  onClick={() => audioService.speak(lastNpcTurn.text, saveState.targetLanguage, 0.75)}
                  className="px-2 py-0.5 rounded-full hover:bg-sand/80 text-[11px] text-ink transition-colors"
                  title="Slow replay"
                >
                  🐢 0.75×
                </button>
              </>
            )}
            <button
              onClick={() => setShowTranslations(!showTranslations)}
              className={`px-2 py-0.5 rounded-full transition-colors flex items-center gap-1 text-[11px] ${showTranslations ? "bg-lagoon/15 text-lagoon font-bold" : "hover:bg-sand text-muted"}`}
              title="Toggle translations"
            >
              <Globe size={12} />
              <span>EN</span>
            </button>
            <button
              onClick={leaveConversation}
              className="p-1 rounded-full text-muted hover:text-danger hover:bg-sand/60 transition-colors"
              title="Leave (Esc)"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Full scrollable transcript - all turns visible */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
          {activeConversation.turns.map((turn) => {
            const isNpc = turn.speaker === "npc";
            return (
              <div key={turn.id} className={`flex flex-col ${isNpc ? "items-start" : "items-end"} animate-fadeIn`}>
                <span className="text-[10px] font-bold tracking-wider text-muted/70 uppercase mb-0.5 px-1">
                  {isNpc ? turn.speakerName : saveState.playerName}
                </span>
                <div className={`max-w-[90%] rounded-2xl px-3 py-2 leading-snug select-text ${
                  isNpc ? "bg-paper border border-line text-ink shadow-xs" : "bg-coral/10 text-ink border border-coral/20"
                }`}>
                  <div className={`font-semibold text-sm leading-relaxed`}>{turn.text}</div>
                  {showTranslations && turn.translation && (
                    <div className="text-[11px] text-muted mt-1 italic font-normal pt-1 border-t border-line/40">
                      {turn.translation}
                    </div>
                  )}
                </div>
                {turn.correction && (
                  <div className="mt-1">
                    <button
                      onClick={() => setExpandedCorrectionId(expandedCorrectionId === turn.id ? null : turn.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sun/20 border border-sun/50 text-[11px] font-semibold text-ink hover:bg-sun/30 transition-colors"
                    >
                      <Sparkles size={10} className="text-sun" />
                      <span>✦ More natural: &ldquo;{turn.correction.suggested}&rdquo;</span>
                    </button>
                    {expandedCorrectionId === turn.id && (
                      <div className="mt-1 p-2 rounded-xl bg-sun/10 border border-sun/30 text-xs text-ink max-w-full">
                        <span className="font-bold">Tip: </span>{turn.correction.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {activeConversation.phase === "npc-thinking" && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-paper border border-line w-fit">
              <span className="w-2 h-2 rounded-full bg-coral animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-coral animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-coral animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-muted ml-1">{activeConversation.npcName} is thinking...</span>
            </div>
          )}
          <div ref={turnsEndRef} />
        </div>

        {/* Hint Ladder */}
        {showHintLadder && (
          <div className="px-3 pb-2 shrink-0">
            <HintLadder onInsertReply={handleInsertHintReply} onClose={() => setShowHintLadder(false)} />
          </div>
        )}

        {/* Level Progression Banner */}
        {canAdvanceLevel && (
          <div className="shrink-0 m-2.5 p-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/15 border border-emerald-500/35 flex items-center justify-between gap-2.5 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Check size={13} strokeWidth={3} />
              </div>
              <div>
                <div className="text-xs font-bold text-ink">
                  {saveState.currentDay === 1 ? "Keys collected! Day 1 Complete" : `Day ${saveState.currentDay} Objectives Done`}
                </div>
                <div className="text-[10px] text-muted leading-tight">
                  Ready to advance to Day {Math.min(saveState.currentDay + 1, 7)}
                </div>
              </div>
            </div>
            <button
              onClick={advanceToNextDay}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1 shrink-0"
            >
              <span>Day {Math.min(saveState.currentDay + 1, 7)}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* Suggestions */}
        <div className="shrink-0 px-3 pb-1.5 flex flex-wrap gap-1.5 border-t border-line/50 pt-2">
          <span className="text-[10px] font-bold text-muted flex items-center gap-1 w-full">
            <Lightbulb size={11} className="text-sun" /> What to say:
          </span>
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => { setInputText(sug.text); setInputMode("text"); }}
              className="px-2.5 py-1 rounded-full bg-sand/60 hover:bg-sand border border-line text-[11px] font-medium text-ink whitespace-nowrap transition-colors"
              title={sug.translation}
            >
              &ldquo;{sug.text}&rdquo;
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="shrink-0 px-3 pb-3 pt-1.5 border-t border-line">
          {inputMode === "voice" ? (
            <VoiceRecorder
              onSendTranscript={(text) => sendMessage(text, "voice")}
              onSwitchToText={() => setInputMode("text")}
              onOpenHint={() => { setShowHintLadder(true); setHintLevel(1); }}
            />
          ) : (
            <div className="flex flex-col gap-1.5">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Type freely in ${saveState.targetLanguage === "fr" ? "French" : saveState.targetLanguage === "es" ? "Spanish" : saveState.targetLanguage === "it" ? "Italian" : "English"}... any words work!`}
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-paper border border-line focus:border-lagoon text-ink font-medium text-sm focus:outline-none shadow-xs resize-none"
                autoFocus
              />
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { setShowHintLadder(!showHintLadder); if (!showHintLadder) setHintLevel(1); }}
                  className={`px-3 py-1.5 rounded-xl transition-all text-xs font-semibold flex items-center gap-1 ${showHintLadder ? "bg-sun text-ink" : "bg-sand/70 hover:bg-sand text-ink"}`}
                >
                  <Lightbulb size={13} className="text-sun" /> Hint (H)
                </button>
                <button
                  onClick={() => setInputMode("voice")}
                  className="p-2 rounded-xl bg-sand/70 hover:bg-sand text-ink transition-colors"
                  title="Voice mode"
                >
                  <Mic size={15} />
                </button>
                <button
                  onClick={() => handleSend()}
                  disabled={!inputText.trim()}
                  className="flex-1 py-1.5 rounded-xl bg-coral text-paper font-bold hover:scale-105 active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center gap-1.5 text-xs shadow-sm"
                >
                  Submit Response <Send size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
