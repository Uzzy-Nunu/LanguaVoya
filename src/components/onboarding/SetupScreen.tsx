"use client";

import React, { useState } from "react";
import { TargetLanguage, CefrLevel, InterfaceLanguage } from "@/types/game";
import { ArrowRight, Check } from "lucide-react";

interface SetupScreenProps {
  initialTargetLang: TargetLanguage;
  initialLevel: CefrLevel;
  initialInterfaceLang: InterfaceLanguage;
  onComplete: (target: TargetLanguage, level: CefrLevel, iface: InterfaceLanguage, playerName: string) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  initialTargetLang,
  initialLevel,
  initialInterfaceLang,
  onComplete,
}) => {
  const [playerName, setPlayerName] = useState("Alex");
  const [targetLang, setTargetLang] = useState<TargetLanguage>(initialTargetLang);
  const [level, setLevel] = useState<CefrLevel>(initialLevel);
  const [interfaceLang, setInterfaceLang] = useState<InterfaceLanguage>(initialInterfaceLang);

  const languages: Array<{ id: TargetLanguage; label: string; location: string; flag: string }> = [
    { id: "fr", label: "Français", location: "Valmer, France", flag: "🇫🇷" },
    { id: "es", label: "Español", location: "San Pedro, España", flag: "🇪🇸" },
    { id: "it", label: "Italiano", location: "Bellavita, Italia", flag: "🇮🇹" },
    { id: "en", label: "English", location: "Lilac Town, UK", flag: "🇬🇧" },
  ];

  const levels: Array<{ id: CefrLevel; title: string; desc: string }> = [
    { id: "A1", title: "Just starting", desc: "I know hello and a few words." },
    { id: "A2", title: "I know some", desc: "I can say basic phrases and order food." },
    { id: "B1", title: "Comfortable basics", desc: "I can hold simple conversations." },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gradient-to-br from-[#1C2A39] via-[#2A3B4C] to-[#14707A] p-2 select-none sm:items-center sm:p-4">
      <div className="my-auto flex max-h-[calc(100dvh-1rem)] w-full max-w-4xl flex-col gap-3 overflow-y-auto overscroll-contain rounded-2xl border border-line p-3 text-ink shadow-e2 paper-glass-strong sm:gap-6 sm:rounded-3xl sm:p-8 md:flex-row">
        {/* Left Col: Selections */}
        <div className="flex-1 space-y-3 sm:space-y-5">
          <div>
            <span className="text-xs font-bold text-coral uppercase tracking-wider block mb-1">
              Personalise Your Experience
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-ink">
              Two quick choices, then you're in.
            </h2>
          </div>

          {/* Player Name */}
          <div>
            <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-2">
              What's your name?
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.slice(0, 24))}
              placeholder="Enter your name..."
              className="w-full px-3 py-2 rounded-xl bg-paper border border-line focus:border-lagoon text-ink font-semibold text-sm focus:outline-none shadow-xs"
              maxLength={24}
              autoFocus
            />
            <p className="text-[11px] text-muted mt-1">This name will be used throughout the game.</p>
          </div>

          {/* Language cards */}
          <div>
            <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-2">
              I want to practise
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {languages.map((lang) => {
                const selected = targetLang === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => setTargetLang(lang.id)}
                    className={`flex items-start justify-between rounded-2xl border p-2 text-left transition-all sm:p-3 ${
                      selected
                        ? "bg-paper border-coral shadow-xs ring-2 ring-coral/20"
                        : "bg-paper/60 border-line hover:bg-paper"
                    }`}
                  >
                    <div>
                      <span className="mb-0.5 block text-lg sm:mb-1 sm:text-xl">{lang.flag}</span>
                      <div className="font-bold text-sm text-ink">{lang.label}</div>
                      <div className="text-[11px] text-muted">{lang.location}</div>
                    </div>
                    {selected && (
                      <div className="w-4 h-4 rounded-full bg-coral text-paper flex items-center justify-center shrink-0">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level selector */}
          <div>
            <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-2">
              My current level
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {levels.map((lvl) => {
                const selected = level === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => setLevel(lvl.id)}
                    className={`rounded-xl border p-2 text-left transition-all sm:p-2.5 ${
                      selected
                        ? "bg-paper border-lagoon shadow-xs ring-2 ring-lagoon/20"
                        : "bg-paper/60 border-line hover:bg-paper"
                    }`}
                  >
                    <div className="text-[11px] font-bold leading-tight text-ink sm:text-xs">{lvl.title}</div>
                    <div className="mt-0.5 text-[9px] leading-snug text-muted sm:text-[10px]">{lvl.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interface language */}
          <div className="flex items-center justify-between pt-2 border-t border-line text-xs">
            <span className="font-semibold text-ink">Hints and translations in</span>
            <select
              value={interfaceLang}
              onChange={(e) => setInterfaceLang(e.target.value as InterfaceLanguage)}
              className="px-3 py-1.5 rounded-xl bg-sand/60 border border-line text-xs font-bold text-ink focus:outline-none"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
              <option value="it">Italiano</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        {/* Right Col: Seven Days Preview */}
        <div className="flex w-full flex-col justify-between rounded-2xl border border-line bg-sand/30 p-3 sm:p-4 md:w-64">
          <div>
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-3">
              Your Seven Days
            </span>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] sm:flex sm:flex-col sm:gap-0 sm:space-y-2 sm:text-xs">
              {[
                "🚪 Day 1 · Arrival",
                "🧺 Day 2 · Groceries",
                "🚌 Day 3 · Getting around",
                "☕ Day 4 · Café",
                "🔧 Day 5 · Everyday problems",
                "👥 Day 6 · Social life",
                "🧭 Day 7 · Independent day",
              ].map((day, idx) => (
                <div key={idx} className="font-medium text-ink flex items-center gap-1.5">
                  <span className="text-muted/60 text-[10px]">{idx + 1}.</span>
                  <span>{day}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted mt-3 italic leading-relaxed">
              Take them at your own pace — no daily lock.
            </p>
          </div>

          <button
            onClick={() => onComplete(targetLang, level, interfaceLang, playerName.trim() || "Alex")}
            className="sticky bottom-0 mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-coral py-3 text-sm font-bold text-paper shadow-md transition-all hover:scale-[1.02] active:scale-95"
          >
            <span>Continue</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
