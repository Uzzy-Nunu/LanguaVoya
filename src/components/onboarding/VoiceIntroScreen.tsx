"use client";

import React, { useState } from "react";
import { Mic, Keyboard, ArrowRight, Volume2 } from "lucide-react";

interface VoiceIntroScreenProps {
  onFinish: (voiceEnabled: boolean) => void;
}

export const VoiceIntroScreen: React.FC<VoiceIntroScreenProps> = ({ onFinish }) => {
  const [selectedMode, setSelectedMode] = useState<"voice" | "type">("voice");
  const [micTested, setMicTested] = useState(false);

  const handleTestMic = () => {
    setMicTested(true);
    // Request permission if browser supports
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          stream.getTracks().forEach((track) => track.stop());
          setMicTested(true);
        })
        .catch(() => setMicTested(false));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-[#1C2A39] via-[#2A3B4C] to-[#14707A] select-none">
      <div className="w-full max-w-lg paper-glass-strong rounded-3xl p-6 sm:p-8 text-ink shadow-e2 border border-line text-center">
        <span className="text-xs font-bold text-coral uppercase tracking-wider block mb-1">
          Input Preference
        </span>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-ink mb-2">
          Talk or type — your choice
        </h2>
        <p className="text-xs text-muted mb-5 max-w-sm mx-auto">
          Both voice input and keyboard text are full, complete ways to play. You can switch any time.
        </p>

        {/* 2 Big Choice Cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={() => setSelectedMode("voice")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedMode === "voice"
                ? "bg-paper border-coral shadow-xs ring-2 ring-coral/20"
                : "bg-paper/60 border-line hover:bg-paper"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-coral/10 text-coral flex items-center justify-center mb-2">
              <Mic size={20} />
            </div>
            <div className="font-bold text-sm text-ink">Use my voice</div>
            <div className="text-[11px] text-muted mt-1 leading-snug">
              Speak to neighbours in town. Edit transcripts anytime.
            </div>
          </button>

          <button
            onClick={() => setSelectedMode("type")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedMode === "type"
                ? "bg-paper border-lagoon shadow-xs ring-2 ring-lagoon/20"
                : "bg-paper/60 border-line hover:bg-paper"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-lagoon/10 text-lagoon flex items-center justify-center mb-2">
              <Keyboard size={20} />
            </div>
            <div className="font-bold text-sm text-ink">I'll type</div>
            <div className="text-[11px] text-muted mt-1 leading-snug">
              Same contextual conversations with your keyboard.
            </div>
          </button>
        </div>

        {/* Mic testing widget if voice chosen */}
        {selectedMode === "voice" && (
          <div className="p-3 rounded-2xl bg-sand/40 border border-line mb-5 text-xs text-muted flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-coral animate-ping" />
              <span>Voice ready — recording starts only when you tap the mic</span>
            </div>
            <button
              onClick={handleTestMic}
              className="px-2.5 py-1 rounded-lg bg-paper border border-line text-ink font-semibold hover:bg-sand transition-colors text-[11px]"
            >
              {micTested ? "Microphone ready ✓" : "Test mic"}
            </button>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => onFinish(selectedMode === "voice")}
            className="w-full py-3.5 rounded-2xl bg-coral text-paper font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Enter Town & Begin Day 1</span>
            <ArrowRight size={16} />
          </button>

          {selectedMode === "voice" && (
            <button
              onClick={() => onFinish(false)}
              className="w-full py-2 text-xs text-muted hover:text-ink font-medium"
            >
              Skip — I'll type instead
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
